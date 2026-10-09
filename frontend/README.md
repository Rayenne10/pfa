# Velora React frontend

The existing hotel-booking UI includes the monitoring page at `/observability`. The production container serves static assets and proxies same-origin API requests to NestJS services. Development uses Vite's `/api` proxy.

See the root [README](../README.md) for setup. Run `npm ci && npm run build` to verify the TypeScript/React production build. `browser-check.mjs` runs against a live stack and checks monitoring rendering, mobile overflow and unavailable-data feedback.
