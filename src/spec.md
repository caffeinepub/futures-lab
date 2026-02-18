# Specification

## Summary
**Goal:** Restore reliable app startup so the UI always reaches a stable signed-out (AuthGate) or signed-in (AppLayout + route) state, with actionable error handling and basic self-diagnostics when initialization fails.

**Planned changes:**
- Fix initialization flow to prevent stuck loading/blank screen and ensure AppInitGate consistently resolves to AuthGate (signed out) or the main router (signed in), and shows the existing “Unable to Initialize” error UI with working Retry/Sign Out when init fails.
- Resolve frontend/backend type mismatch issues for generated canister bindings (notably Motoko variant shapes) so HealthStatusBanner and TradingModeBanner/Switcher correctly interpret and compare runtime values without TypeScript or runtime rendering errors.
- Make actor initialization resilient for non-admin users by gating admin-only initialization behind presence of an admin token, ensuring standard authenticated flows (profile, datasets, prompts) work without missing-secret failures or authorization traps.
- Add a minimal, user-visible startup diagnostics panel/section that shows auth state, actor readiness, and latest health/profile probe results with normalized error messages, accessible without developer tools and not blocking normal operation.

**User-visible outcome:** On launch, signed-out users see the AuthGate quickly (no infinite spinner), signed-in users reach the main app routes on a healthy backend, initialization failures show a clear retryable error state, and users can open a small diagnostics view to understand why startup/initialization is failing.
