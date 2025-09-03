export default {
  async fetch(request, env) {
    // Try to serve the exact static asset first.
    const res = await env.ASSETS.fetch(request);

    // SPA fallback: if not found and it's a navigation request, serve index.html
    if (res.status === 404 && (request.method === 'GET' || request.method === 'HEAD')) {
      const accept = request.headers.get('accept') || '';
      if (accept.includes('text/html')) {
        // Use relative index.html, preserving the original request’s URL origin
        const indexReq = new Request(new URL('index.html', request.url), request);
        return env.ASSETS.fetch(indexReq);
      }
    }

    return res;
  }
};
