// Minimal surface of the Mixpanel JS SDK loaded via the snippet in
// index.html. The snippet installs a stub that queues calls until the real
// SDK arrives, so these methods are safe to call immediately.
interface MixpanelLib {
  init(token: string, config?: Record<string, unknown>): void;
  track(event: string, props?: Record<string, unknown>): void;
  register(props: Record<string, unknown>): void;
  set_config(config: Record<string, unknown>): void;
  // present once the real SDK replaces the snippet stub
  get_property?(name: string): unknown;
}

interface Window {
  mixpanel?: MixpanelLib;
}
