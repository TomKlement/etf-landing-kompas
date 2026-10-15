import type { NextConfig } from "next";

// PostHog ingestion host for your project's region: EU = eu.i.posthog.com, US = us.i.posthog.com
const POSTHOG_HOST = process.env.POSTHOG_HOST ?? "eu.i.posthog.com";
const POSTHOG_ASSETS = POSTHOG_HOST.replace(".i.posthog.com", "-assets.i.posthog.com");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: `https://${POSTHOG_ASSETS}/static/:path*` },
      { source: "/ingest/:path*", destination: `https://${POSTHOG_HOST}/:path*` },
    ];
  },
  // PostHog API paths use trailing slashes; don't let Next redirect them away.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
