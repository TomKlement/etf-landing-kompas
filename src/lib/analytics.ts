import posthog from "posthog-js";

/**
 * Custom funnel events. The first step ($pageview) is captured automatically by posthog-js.
 * Keep names in sync with the PostHog funnel.
 */
type Events = {
  calculator_interacted: { control: "scenario" | "monthly" | "years" | "return" | "custom_fund"; scenario: string };
  lead_form_viewed: { placement: "calculator" | "mapping" | "final"; scenario?: string };
  lead_submitted: { placement: "calculator" | "mapping" | "final"; scenario?: string };
};

export function track<E extends keyof Events>(event: E, props: Events[E]) {
  if (!posthog.__loaded) return;
  posthog.capture(event, props);
}

const fired = new Set<string>();

/** Same as track(), but at most once per page load for a given key. */
export function trackOnce<E extends keyof Events>(key: string, event: E, props: Events[E]) {
  if (fired.has(key)) return;
  fired.add(key);
  track(event, props);
}
