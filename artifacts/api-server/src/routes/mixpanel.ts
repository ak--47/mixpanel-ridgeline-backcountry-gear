import {
  Router,
  raw,
  type IRouter,
  type Request,
  type Response,
} from "express";
import { parseSDKData } from "../lib/mixpanel-parser";
import { logger } from "../lib/logger";

/**
 * First-party proxy for the Mixpanel JS SDK. Mounted at /api/mp BEFORE the
 * global body parsers in app.ts — SDK payloads arrive as raw JSON, base64,
 * or sendBeacon `data=` forms that express.json()/urlencoded() would mangle.
 */

const MP_API = "https://api.mixpanel.com";
const MP_CDN = "https://cdn.mxpnl.com";

type IngestType = "track" | "engage" | "groups";

const router: IRouter = Router();

router.use(raw({ type: "*/*", limit: "20mb" }));

function rawBody(req: Request): Buffer | undefined {
  return Buffer.isBuffer(req.body) ? req.body : undefined;
}

function queryString(req: Request): string {
  const qs = req.originalUrl.split("?")[1];
  return qs ? `?${qs}` : "";
}

function endUserIp(req: Request): string | undefined {
  const forwarded = req.headers["x-forwarded-for"];
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return first?.split(",")[0]?.trim() || req.socket.remoteAddress || undefined;
}

function handleError(res: Response, context: string) {
  return (err: unknown) => {
    logger.error({ err }, `mixpanel proxy error: ${context}`);
    if (!res.headersSent) {
      res.status(500).json({ error: "mixpanel proxy error" });
    }
  };
}

// CDN passthrough for the SDK bundle and its async modules (session
// recorder, etc.) — the snippet's loader src and the SDK's lib_base_path
// both point here so nothing is fetched from cdn.mxpnl.com directly.
router.get(/^\/libs\/.+\.js$/, (req, res) => {
  void (async () => {
    const libPath = req.path.replace(/^\/libs\//, "");
    const upstream = await fetch(`${MP_CDN}/libs/${libPath}`);
    const body = Buffer.from(await upstream.arrayBuffer());
    res
      .status(upstream.status)
      .set("Content-Type", "application/javascript; charset=utf-8")
      .set("Cache-Control", "public, max-age=300")
      .send(body);
  })().catch(handleError(res, "libs"));
});

// Opaque passthrough for session replay + feature flags. Bodies may be
// compressed (content-encoding) — forward the raw buffer untouched.
function passthrough(req: Request, res: Response, context: string) {
  void (async () => {
    const headers: Record<string, string> = {};
    // authorization carries the project token (Basic auth) for /record.
    // content-encoding is deliberately NOT forwarded: the raw() body parser
    // inflates gzip/deflate bodies, so relaying the original header would
    // tell Mixpanel to decompress an already-decompressed payload.
    for (const name of ["content-type", "authorization"]) {
      const value = req.headers[name];
      if (typeof value === "string") headers[name] = value;
    }
    const upstream = await fetch(`${MP_API}${req.path}${queryString(req)}`, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : rawBody(req),
    });
    res
      .status(upstream.status)
      .set(
        "Content-Type",
        upstream.headers.get("content-type") ?? "application/json",
      )
      .send(Buffer.from(await upstream.arrayBuffer()));
  })().catch(handleError(res, context));
}

// Regex routes: bare "/record/*" string patterns throw in Express 5.
router.all(/^\/record(\/.*)?$/, (req, res) => passthrough(req, res, "record"));
router.all(/^\/flags(\/.*)?$/, (req, res) => passthrough(req, res, "flags"));

// Row-level ingestion: decode the SDK payload, optionally stamp the end-user
// IP (SDK requests ?ip=1 so geolocation reflects the client, not this server),
// then re-send as plain JSON.
function ingest(type: IngestType, req: Request, res: Response) {
  void (async () => {
    const records = parseSDKData(rawBody(req)?.toString("utf-8"));
    if (req.query.ip === "1") {
      const ip = endUserIp(req);
      if (ip) {
        for (const record of records) {
          if (type === "track") {
            record.properties = { ...record.properties, ip };
          } else {
            record.$ip = ip;
          }
        }
      }
    }
    const upstream = await fetch(`${MP_API}/${type}?verbose=1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(records),
    });
    res.status(upstream.status).json(await upstream.json());
  })().catch(handleError(res, type));
}

router.post("/track", (req, res) => ingest("track", req, res));
router.post("/engage", (req, res) => ingest("engage", req, res));
router.post("/groups", (req, res) => ingest("groups", req, res));

router.all("/decide", (_req, res) => {
  res.status(299).json({ error: "the /decide endpoint is deprecated" });
});

export default router;
