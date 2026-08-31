import { logger } from "./logger";

/**
 * Decodes an incoming Mixpanel JS SDK payload into an array of records.
 * The SDK sends JSON (XHR transport), but falls back to sendBeacon on page
 * unload, which arrives as urlencoded `data=<json|base64>` — every branch
 * here is required.
 */
export function parseSDKData(
  reqBody: string | Record<string, unknown> | unknown[] | null | undefined,
): Record<string, any>[] {
  if (reqBody === undefined || reqBody === null) return [];

  try {
    let data: unknown;

    if (typeof reqBody === "string") {
      const trimmed = reqBody.trim();

      if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
        data = JSON.parse(trimmed);
      } else {
        try {
          data = JSON.parse(Buffer.from(trimmed, "base64").toString("utf-8"));
        } catch {
          // sendBeacon form: data=VALUE (VALUE is urlencoded JSON or base64)
          const eqIndex = trimmed.indexOf("=");
          if (eqIndex < 0) {
            throw new Error("unable to parse incoming data (no delimiter)");
          }
          const body = trimmed.substring(eqIndex + 1);
          if (!body) {
            throw new Error("unable to parse incoming data (tried sendBeacon)");
          }
          const decoded = decodeURIComponent(body);
          try {
            data = JSON.parse(decoded);
          } catch {
            data = JSON.parse(Buffer.from(decoded, "base64").toString("utf-8"));
          }
        }
      }
    } else if (Array.isArray(reqBody)) {
      const first = reqBody[0] as Record<string, unknown> | undefined;
      if (reqBody.length && typeof first?.data === "string") {
        data = reqBody.map((r) =>
          JSON.parse((r as Record<string, string>).data),
        );
      } else {
        data = reqBody;
      }
    } else if (typeof reqBody === "object") {
      data = [reqBody];
    } else {
      throw new Error("unable to parse incoming data (unknown format)");
    }

    return Array.isArray(data) ? data : [data as Record<string, any>];
  } catch (err) {
    logger.error({ err }, "unable to parse incoming Mixpanel SDK data");
    return [];
  }
}
