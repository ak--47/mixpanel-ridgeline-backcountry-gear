const MIXPANEL_TOKEN = '9808948117379d8359974dc99f9ae479';
const MIXPANEL_PROJECT_ID = '4059355';
const MIXPANEL_WORKSPACE_ID = '4555726';

// This project is shared by several demo sites, so every event carries the
// site it came from. `site_id` is sha256(site) truncated to 12 hex chars.
const SITE = 'ridgeline-supply';
const SITE_ID = 'bae6c05662f6';
const SITE_NAME = 'Ridgeline Supply Co.';

// Everything except pageview: 'full-url' is applied at init; pageview is
// enabled via set_config afterwards — see initAnalytics.
const AUTOCAPTURE_CONFIG = {
  click: false,
  input: false,
  submit: false,
  scroll: true,
  dead_click: true,
  rage_click: true,
  page_leave: true,
};

/**
 * Initializes Mixpanel (loaded via the snippet in index.html) through the
 * first-party proxy at /api/mp. Users are anonymous — device_id only, no
 * identify()/people.set(); visitor traits ride along as super properties.
 */
export function initAnalytics(): void {
  if (!window.mixpanel) return; // snippet failed to load; tracking no-ops

  window.mixpanel.init(MIXPANEL_TOKEN, {
    api_host: `${window.location.origin}/api/mp`,
    // async SDK modules (recorder, etc.) also load through the proxy
    lib_base_path: `${window.location.origin}/api/mp/libs/`,
    api_transport: 'XHR',
    api_payload_format: 'json',
    persistence: 'localStorage',
    ignore_dnt: true,
    // near-instant event delivery without the setTimeout(0) busy loop a
    // 0ms flush interval creates (the SDK reschedules even on empty batches)
    batch_flush_interval_ms: 1000,

    // clicks/inputs/submits are precision-tracked via track() call sites;
    // pageview starts disabled so the entry $mp_web_page_view (fired
    // synchronously during init, before register() can run) doesn't ship
    // without the super properties — re-enabled via set_config below
    autocapture: { ...AUTOCAPTURE_CONFIG, pageview: false },

    // full session replay, nothing redacted
    record_sessions_percent: 100,
    record_mask_text_selector: 'nope',
    record_mask_all_inputs: false,
    record_block_selector: 'nope',
    record_block_class: 'nope',
    record_inline_images: true,
    record_collect_fonts: true,
    record_canvas: true,
    record_heatmap_data: true,
  });

  window.mixpanel.register({
    site: SITE,
    site_id: SITE_ID,
    site_name: SITE_NAME,
    device: detectDevice(),
    new_vs_returning: isNewVisitor(),
  });
  markVisited();

  // now that super properties are registered, turn pageview tracking on —
  // the autocapture module re-inits and fires the initial pageview here
  window.mixpanel.set_config({
    autocapture: { ...AUTOCAPTURE_CONFIG, pageview: 'full-url' },
  });
}

export function track(event: string, props?: Record<string, any>): void {
  window.mixpanel?.track(event, props);
}

/**
 * Mixpanel profile URL for the current (anonymous) visitor. There are no
 * identify() calls, so the profile lives under `$device:<device_id>`.
 * Returns null until the SDK has loaded and minted a device_id.
 */
export function getProfileUrl(): string | null {
  const deviceId = window.mixpanel?.get_property?.('$device_id');
  if (!deviceId || typeof deviceId !== 'string') return null;
  const distinctId = encodeURIComponent(`$device:${deviceId}`);
  return `https://mixpanel.com/project/${MIXPANEL_PROJECT_ID}/view/${MIXPANEL_WORKSPACE_ID}/app/profile#distinct_id=${distinctId}`;
}

function detectDevice(): 'mobile' | 'desktop' {
  return window.innerWidth < 768 ? 'mobile' : 'desktop';
}

function isNewVisitor(): 'new' | 'returning' {
  return localStorage.getItem('has_visited') ? 'returning' : 'new';
}

function markVisited(): void {
  localStorage.setItem('has_visited', 'true');
}
