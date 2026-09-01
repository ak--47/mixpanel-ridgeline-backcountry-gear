# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

- **The cart is a context, not a hook.** `src/hooks/use-cart.tsx` exports `CartProvider` +
  `useCart()`, and `App.tsx` wraps the tree in it. It used to be a plain `useState` hook, so
  Navbar, CartDrawer, ProductDetail and Checkout each held their own copy and only saw each
  other's writes after a full page load — adding from a PDP left the drawer showing an empty
  cart and made checkout unreachable. localStorage is the persistence layer, not the sync
  layer. Do not turn it back into a bare hook.
- **`initAnalytics()` runs in `main.tsx`, before the first render** — not from an effect in
  `App`. React runs child effects before the parent's, so `ProductDetail`'s mount-time
  `product_viewed` used to call `track()` before `mixpanel.init()` had installed the
  snippet's method stubs. On a cold load of `/product/:id` that threw
  `window.mixpanel?.track is not a function` and the ErrorBoundary replaced the page with
  "Something went wrong". Do not move it back into `useEffect`.

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Analytics (Mixpanel)

Mixpanel is integrated. Do not remove or bypass any of this.

- Token `9808948117379d8359974dc99f9ae479` — a **shared** project (`4059355`) used by several demo sites. Every event carries super properties `site`, `site_id`, `site_name` so the sites can be told apart. For this site: `site = `ridgeline-supply``, `site_id = `bae6c05662f6``.
- `artifacts/ridgeline-supply/src/lib/analytics.ts` is the single integration point (init + `track`). No other file calls the SDK directly.
- All SDK traffic — the library, its async modules, tracking, session replay, flags — goes through a first-party proxy at `/api/mp` (`artifacts/api-server/src/routes/mixpanel.ts`). Nothing is requested from `*.mixpanel.com` or `cdn.mxpnl.com`. The loader snippet in `index.html` points at `/api/mp/libs/`.
- The proxy is mounted in `app.ts` **before** `express.json()`/`express.urlencoded()`. SDK payloads are raw JSON, base64, or `sendBeacon` `data=` forms that the body parsers destroy. Never move it below them.
- Tracking is anonymous: device_id only. Do not add `identify()` or `people.set()`.
- Autocapture is selective: pageview, scroll, dead click, rage click, page leave. Generic click/input/submit autocapture is OFF on purpose — those are precision-tracked at `track()` call sites. Pageview starts `false` at init and is enabled via `set_config` after `register()`, so the entry pageview carries the super properties.
- Session replay runs at 100%, nothing masked or blocked.
- Action elements also carry `data-analytics-event` and matching `data-analytics-*` attributes.
- The footer has an "Open Mixpanel" button that deep-links to the current visitor's profile.

Events tracked on this site: `product_viewed`, `product_card_clicked`, `variant_selected`, `add_to_cart`, `remove_from_cart`, `cart_quantity_changed`, `pdp_quantity_changed`, `cart_drawer_toggled`, `favorite_toggled`, `shop_filter_changed`, `shop_sort_changed`, `checkout_started`, `place_order_clicked`, `purchase_completed`, `continue_shopping_clicked`, `journal_entry_clicked`, `hero_cta_clicked`, `section_cta_clicked`, `nav_clicked`, `mobile_menu_toggled`, `footer_link_clicked`, `social_link_clicked`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
