export default {
  async fetch(request, env) {
    // First, attempt to serve the exact static asset.
    const res = await env.ASSETS.fetch(request);

    // If the asset wasn't found and it's a navigation request, return index.html
    if (res.status === 404 && request.method === 'GET') {
      const accept = request.headers.get('accept') || '';
      if (accept.includes('text/html')) {
        const url = new URL(request.url);
        const indexReq = new Request(new URL('/index.html', url.origin), request);
        return env.ASSETS.fetch(indexReq);
      }
    }

    return res;
  }
};

