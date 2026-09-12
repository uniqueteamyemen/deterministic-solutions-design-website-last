# Development Automation

The development preview includes a **free local refresh agent** for environments where the preview proxy does not allow Vite WebSockets. It runs only when `import.meta.env.DEV` is true and is not included in the production build.

| Option | Transport | Cost | Suitability for this preview |
|---|---|---:|---|
| Vite HMR | WebSocket | Free | Not usable here because the managed preview proxy rejects WebSocket upgrades. |
| Local refresh agent — implemented | HTTPS polling every 1.5 seconds | Free | Suitable: no WebSocket, no external service, no credentials. |
| External tunnel or hosted watcher | Varies | Usually paid or account-bound | Not used; it would add operational scope without improving the production site. |

The implemented agent works as follows. Vite observes local source changes and increments an in-memory revision. The browser requests `/__manus__/dev-refresh` over ordinary HTTPS at a bounded interval. When the revision or the development-server instance changes, the browser reloads once. The local compatibility module for `/@vite/client` supports transformed CSS modules but creates no WebSocket connection.

Run the normal development command:

```bash
pnpm dev
```

No account, API key, subscription, background scheduler, or external endpoint is required. The agent deliberately does not run tests or publish/deploy changes automatically. Use `pnpm test` and `pnpm build` to validate a change before a checkpoint or publication review.
