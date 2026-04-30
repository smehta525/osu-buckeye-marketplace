# Test Plan & QA Report — Buckeye Marketplace

**Project:** OSU Buckeye Marketplace
**Milestone:** 6 — Production Deployment
**Author:** Shreya Mehta
**Date:** April 30, 2026

---

## 1. Test Environment

| Component | Value |
|---|---|
| Frontend (production) | https://polite-beach-0f0c3400f.7.azurestaticapps.net |
| Backend API (production) | https://buckeye-api-shreyas.azurewebsites.net |
| API documentation (Swagger) | https://buckeye-api-shreyas.azurewebsites.net/ |
| Database | Azure SQL — `buckeye-sql-sm2026` / `BuckeyeMarketplaceDb` |
| Test devices | MacBook (M-series), iPhone for mobile spot-check |
| Test browsers | Safari 17 (macOS), Chrome 124 (macOS), Firefox 125 (macOS) |

**Test users used during QA:**
- Admin: `admin@buckeyemarketplace.com` / `Admin123!`
- Buyer: registered fresh accounts during testing

---

## 2. Test Strategy

Testing was performed at three levels:

1. **Automated unit + component tests** — run on every push via GitHub Actions.
2. **Automated end-to-end tests** — Playwright smoke test for the critical browse → cart → checkout path.
3. **Manual exploratory testing** — performed against the deployed production environment in three browsers and on mobile.

The deployed production environment was the system under test for all manual checks. Local environments were used only for fixing bugs once they were reproduced.

---

## 3. Automated Test Coverage

| Layer | Tool | Test count | Status |
|---|---|---|---|
| Backend unit / integration | xUnit (.NET) | 9 | All passing |
| Frontend component / API | Vitest + React Testing Library | 13 | All passing |
| End-to-end | Playwright | 1 (browse → cart → checkout) | Passing |

These run automatically in the CI pipeline. The deploy step is gated on tests passing — a red test blocks deployment.

---

## 4. Functional Test Cases (User Flows)

### 4.1 Browse Products
| # | Step | Expected | Result |
|---|---|---|---|
| F1 | Open frontend URL | Homepage renders with 9 seeded products | Pass |
| F2 | Click a product card | Detail view shows full description, price, seller, image | Pass |
| F3 | Filter / search products | Listing updates accordingly | Pass |
| F4 | Open page with no auth | Public products are visible without login | Pass |

### 4.2 Account Creation & Login
| # | Step | Expected | Result |
|---|---|---|---|
| F5 | Click Register, submit valid form | New account created, auto-logged-in, JWT stored | Pass |
| F6 | Register with already-used email | Server returns clear error, UI shows it | Pass |
| F7 | Login with admin credentials | Returns token, role=Admin, admin UI accessible | Pass |
| F8 | Login with wrong password | 401 returned, error displayed inline | Pass |
| F9 | Refresh token flow on expired token | API call retries silently, no logout | Pass |

### 4.3 Cart
| # | Step | Expected | Result |
|---|---|---|---|
| F10 | Add a product to cart while logged in | Cart count increments, item appears in cart | Pass |
| F11 | Update quantity | Total recalculates, server persists change | Pass |
| F12 | Remove an item | Item disappears, total updates | Pass |
| F13 | Try to add to cart while logged out | Redirect to login | Pass |
| F14 | Cart persists across reloads | Items still present after refresh | Pass |

### 4.4 Checkout & Orders
| # | Step | Expected | Result |
|---|---|---|---|
| F15 | Place an order with shipping address | Order created, cart cleared, order ID returned | Pass |
| F16 | View order history | All my orders listed with status, total, items | Pass |
| F17 | Try to checkout with empty cart | Blocked with friendly message | Pass |

### 4.5 Admin Flows
| # | Step | Expected | Result |
|---|---|---|---|
| F18 | Login as admin → admin dashboard | Dashboard accessible, regular users see 403 | Pass |
| F19 | Create a new product | Product appears in catalog immediately | Pass |
| F20 | Update an existing product | Changes reflected in product listing | Pass |
| F21 | Delete a product | Product removed | Pass |
| F22 | View all orders (any user) | Admin sees full order list | Pass |
| F23 | Update an order's status | Status change persists, visible to user | Pass |

---

## 5. Cross-Browser Testing

Manual smoke test of the critical path (browse → register → login → add to cart → checkout) was performed in each browser.

| Browser | Version | Result | Notes |
|---|---|---|---|
| Safari (macOS) | 17 | Pass | Primary development browser. All flows work. |
| Chrome (macOS) | 124 | Pass | No layout or behavior differences observed. |
| Firefox (macOS) | 125 | Pass | No rendering issues; cart sidebar resizes correctly. |

No browser-specific bugs were identified. The application does not rely on any non-standard CSS or JS features.

---

## 6. Mobile Responsiveness

Verified on two viewport widths:

- **iPhone (Safari, 390px):** layout reflows to single-column, header collapses, cart panel becomes full-width sheet. Inputs and buttons remain tap-friendly.
- **iPad-sized (~768px):** transitional layout retains a multi-column product grid and a side cart panel.

Tested using actual iPhone Safari and Chrome DevTools device emulation.

| Area | Result |
|---|---|
| Product grid reflow | Pass |
| Header / navigation | Pass |
| Login & register forms | Pass |
| Cart sidebar | Pass |
| Checkout form | Pass |
| Admin dashboard tables | Acceptable — horizontal scroll at narrow widths |

---

## 7. Bugs Found and Fixed

A summary of real defects encountered during this milestone, with the fixes applied. These are issues caught and resolved before submission.

### B1 — JWT signing key too short, login crashed in production
- **Symptom:** `/api/auth/login` returned HTTP 500 in production. Logs showed `IDX10720: key has '176' bits, must be at least '256'`.
- **Root cause:** `Jwt:Key` in Azure App Settings was 22 characters (176 bits). HS256 requires ≥256 bits.
- **Fix:** Replaced `Jwt__Key` in App Service settings with a 64-character key (512 bits).
- **Verification:** Login round-trip in Postman / curl now returns 200 with a valid JWT.

### B2 — SQLite migrations failed against Azure SQL
- **Symptom:** Backend container hit `ContainerTimeout` repeatedly during startup. App never responded to health probes.
- **Root cause:** Existing EF Core migrations were generated against SQLite (the local dev DB) and used SQLite-flavored SQL incompatible with SQL Server.
- **Fix:** Modified `Program.cs` to call `Database.EnsureCreated()` in production (builds schema from the model directly) while keeping `Migrate()` for local development.
- **Verification:** Production schema created on first boot; products and admin user seeded; subsequent boots are fast.

### B3 — Seeded products not appearing (empty `[]` from `/api/products`)
- **Symptom:** Backend deployed successfully and tables existed, but `/api/products` returned an empty array.
- **Root cause:** Seed data assigned explicit `Id = 1, Id = 2…` values. SQL Server's IDENTITY column rejects manual ID inserts unless `IDENTITY_INSERT` is on, so `SaveChanges()` threw and the catch block swallowed it.
- **Fix:** Removed explicit `Id` properties from the seed objects so SQL Server auto-assigns identity values.
- **Verification:** After dropping and recreating the database, all 9 products are returned by the API.

### B4 — Old sample-app files conflicting with deployed app
- **Symptom:** App Service served the default Azure welcome page instead of the API. Logs showed: `Expected to find only one .runtimeconfig.json but found 3 (BuckeyeMarketplace.Api, Notes.Api, Notes.Api.Tests)`.
- **Root cause:** Earlier lab deployment had left `Notes.Api*` files in `/site/wwwroot`. The .NET launcher couldn't decide which DLL to start.
- **Fix:** Wiped `/site/wwwroot` via Kudu SSH (`rm -rf *`) and redeployed only the Buckeye Marketplace API.
- **Verification:** Single startup file detected; container starts cleanly.

### B5 — App Service hit free-tier quota and stopped (`QuotaExceeded`)
- **Symptom:** App refused all traffic with HTTP 403 "This web app is stopped." `az webapp show` reported state `QuotaExceeded`.
- **Root cause:** F1 (Free) tier has a 60 CPU-minute/day cap. Repeated build-fail-restart cycles during deployment exhausted it.
- **Fix:** Upgraded the App Service Plan to B1 (Basic). B1 has no daily compute quota and is well within Azure for Students credits.
- **Verification:** State changed to `Running`. App stays up under continuous traffic.

### B6 — Frontend couldn't reach backend (CORS / API URL)
- **Symptom:** Deployed frontend showed "Failed to load products." Browser console: `net::ERR_CONNECTION_REFUSED` against `http://localhost:5062/api/products`.
- **Root cause:** Frontend was hardcoding `localhost:5062`. The `.env.production` file existed in Downloads but had not been moved into the project root, so the build used the fallback URL.
- **Fix:** Created `.env.production` and `.env.development` in `frontend/buckeye-marketplace-client/`, refactored `productsApi.ts` to read `import.meta.env.VITE_API_BASE`, rebuilt and redeployed.
- **Verification:** Network tab now shows requests against the Azure backend; products load correctly.
- **Related:** Backend CORS was already configured to whitelist the Static Web App URL via `AllowedOrigins__0`.

### B7 — Frontend build failed (vitest config not typechecking)
- **Symptom:** `npm run build` failed with TS2769: `Object literal may only specify known properties, and 'test' does not exist in type 'UserConfigExport'`.
- **Root cause:** `vite.config.ts` had a `test: {…}` block but imported `defineConfig` from `vite`, which doesn't know about Vitest options.
- **Fix:** Switched the import to `from 'vitest/config'` and added a `/// <reference types="vitest" />` directive.
- **Verification:** Build completes; tests still run via `npm test`.

### B8 — Cart sidebar UI quirks (earlier milestone, fixed)
- **Symptom:** Cart sidebar wasn't resizable and had spacing issues when items were added.
- **Fix:** Made the sidebar resizable and tightened the "added to cart" UI.
- **Verification:** Behavior verified manually across browsers in this milestone.

### B9 — `package-lock.json` conflict (earlier)
- **Symptom:** Inconsistent lockfile after merging earlier branches.
- **Fix:** Regenerated and committed a clean lockfile.

---

## 8. Security Checks

- HTTPS enforced on both frontend (Static Web Apps) and backend (App Service).
- JWT signing key is now ≥256 bits and stored only in Azure App Settings (not in source).
- DB connection string is stored as an App Service connection string and is not committed to the repo.
- SQL Server firewall restricted to Azure services + the developer machine; no public IPs.
- Admin role enforced server-side on protected endpoints — bearer token role claim is checked, not the client UI alone.

---

## 9. Known Limitations

- The B1 plan stays warm but cold-starts can still take 5–10 seconds after long idle periods.
- `EnsureCreated()` is used in production instead of proper migrations. This is acceptable for a school project but in a real production system migrations should be generated for SQL Server and applied through a separate step.
- No rate limiting at the API gateway level.
- No automated browser tests beyond the single Playwright smoke test.

---

## 10. Conclusion

All required user flows (browse, register, login, cart, checkout, order history) and admin flows (product management, order management) work correctly in production. Cross-browser smoke testing in Safari, Chrome, and Firefox passed. Mobile layout responds correctly down to iPhone-width viewports. Multiple non-trivial bugs were found, diagnosed via Azure log streaming, and fixed before submission. CI runs all automated tests on every push and gates deployment on success.

The application is considered ready for the Milestone 6 demo.