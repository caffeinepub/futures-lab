# Specification

## Summary
**Goal:** Resolve the app’s infinite loading issues and add production-ready Binance connectivity and trading (paper/shadow/live) with clear safety controls and reliable error/health handling.

**Planned changes:**
- Fix initialization/auth/actor setup flows so the app reliably reaches either AuthGate or the main layout, with clear error states and recovery actions (retry/sign out) instead of hanging.
- Add a route-level error boundary so runtime UI errors show a user-friendly fallback page rather than a blank/locked screen.
- Add basic reliability/observability UX: backend health check callable from the frontend; consistent loading/empty/error states and actionable messages for all backend calls; timeouts/fallbacks to prevent infinite spinners.
- Add Binance connection UI and backend support: store per-user API credentials with access control, support connect/disconnect, and provide “Test Connection” verification with clear status messaging.
- Implement trading modes (paper/shadow/live) with mode selection and persistent per-user simulated portfolio for paper/shadow; live order placement gated by explicit user confirmation and disabled by default.
- Enforce server-side safety controls for live trading (kill switch, max size/notional limits, per-user live-enabled flag) and record an auditable activity log across all modes.
- Add Trading UI pages integrated into the sidebar: Portfolio/Positions, Orders (place/cancel), Trade History (filters), and Safety Controls; keep styling consistent with the current dashboard and responsive.

**User-visible outcome:** The app loads reliably with clear errors when something fails, users can connect and verify a Binance account, choose paper/shadow/live trading modes, view portfolios and history, place/cancel orders (with safety gates for live), and manage risk controls with visible activity logging.
