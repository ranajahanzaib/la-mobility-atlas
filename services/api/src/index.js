/**
 * LA Mobility Atlas - Cloudflare Worker Entrypoint
 * Handles API routing, R2 bucket queries, and passes through to edge static assets.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API Routing
    if (url.pathname.startsWith("/api/v1/health")) {
      return new Response(
        JSON.stringify({
          status: "healthy",
          service: "la-mobility-atlas-api",
          version: "1.0.0",
          runtime: "cloudflare-workers",
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Direct R2 bucket query endpoint for data releases
    if (url.pathname.startsWith("/api/v1/r2/") && env.DATA_BUCKET) {
      const key = url.pathname.replace("/api/v1/r2/", "");
      const object = await env.DATA_BUCKET.get(key);
      if (!object) {
        return new Response(JSON.stringify({ error: "File not found in R2" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(object.body, {
        headers: {
          "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Fall back to Static Assets (Next.js export) served by Cloudflare CDN
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not Found", { status: 404 });
  },
};
