# openthis

## Cloudflare Workers Deployment

This project is configured to deploy the built Vite assets to Cloudflare Workers with SPA routing support (history mode). The Worker serves files from `dist/` and falls back to `index.html` for unknown routes.

Prerequisites:
- Cloudflare account and `wrangler` CLI available (via `npx` or installed locally)

Config highlights:
- `wrangler.jsonc` defines the Worker and static assets directory
- `worker/index.js` serves assets and provides SPA fallback to `index.html`

Commands:
- Login once: `npx wrangler login`
- Build: `npm run build`
- Deploy: `npm run cf:deploy` (equivalent to `npx wrangler deploy` after build)
- Local dev (Workers): `npm run cf:dev`

Notes:
- By default, `wrangler deploy` publishes to your `*.workers.dev` subdomain. To bind to a custom domain/route, add a `routes` array to `wrangler.jsonc`.

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
