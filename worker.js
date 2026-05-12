/**
 * SAP CORS Proxy — Cloudflare Worker
 *
 * Deploy at: https://workers.cloudflare.com (free, no card needed)
 *
 * Steps:
 *   1. Create a free Cloudflare account at cloudflare.com
 *   2. Go to Workers & Pages → Create Worker
 *   3. Replace the default script with this entire file
 *   4. Click Deploy — you get a URL like https://my-proxy.YOUR-NAME.workers.dev
 *   5. Paste that URL into the app's Settings → CORS Proxy URL field
 *
 * Usage (handled automatically by the app):
 *   GET  https://my-proxy.workers.dev?url=https%3A%2F%2Fsap-tenant%2Fapi%2F...
 *   POST https://my-proxy.workers.dev?url=https%3A%2F%2Fsap-tenant%2Fapi%2F...
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Accept, Content-Type, X-Requested-With, X-CSRF-Token',
  'Access-Control-Expose-Headers': 'X-CSRF-Token',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required query parameter: ?url=<encoded-target-url>' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // Only forward safe, relevant headers — never cookies from the worker's own domain
    const forwardHeaders = new Headers();
    const FORWARD = ['authorization', 'accept', 'content-type', 'x-csrf-token', 'x-requested-with'];
    for (const name of FORWARD) {
      const val = request.headers.get(name);
      if (val) forwardHeaders.set(name, val);
    }

    const upstreamInit = { method: request.method, headers: forwardHeaders };
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      upstreamInit.body = request.body;
      upstreamInit.duplex = 'half'; // required when body is a ReadableStream
    }

    let upstream;
    try {
      upstream = await fetch(targetUrl, upstreamInit);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: `Upstream fetch failed: ${err.message}` }),
        { status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // Rebuild response headers, adding CORS headers
    const respHeaders = new Headers(upstream.headers);
    for (const [k, v] of Object.entries(CORS_HEADERS)) {
      respHeaders.set(k, v);
    }

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: respHeaders,
    });
  },
};
