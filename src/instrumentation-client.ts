import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

// Without a key (local dev, previews) analytics stays off and track() is a no-op.
if (key) {
  posthog.init(key, {
    // Proxied through next.config rewrites so ad blockers don't drop events.
    api_host: "/ingest",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST ?? "https://eu.posthog.com",
    defaults: "2025-05-24",
    // No cookies / localStorage: the page is a single screen, so an in-memory
    // distinct_id is enough to tie pageview → form → lead within one visit.
    persistence: "memory",
    person_profiles: "identified_only",
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") ph.debug();
    },
  });
}
