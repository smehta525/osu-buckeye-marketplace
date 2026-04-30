# Test Plan

**Project:** Buckeye Marketplace
**Milestone:** 6
**Author:** Shreya Mehta
**Date:** April 30, 2026

---

## Environment

| What | Value |
|---|---|
| Frontend | https://polite-beach-0f0c3400f.7.azurestaticapps.net |
| Backend | https://buckeye-api-shreyas.azurewebsites.net |
| Swagger | https://buckeye-api-shreyas.azurewebsites.net/ |
| Database | Azure SQL `BuckeyeMarketplaceDb` on `buckeye-sql-sm2026` |
| Devices | MacBook M-series. iPhone for mobile spot check |
| Browsers | Safari 17, Chrome 124, Firefox 125 (all macOS) |

Test users:
- Admin: `admin@buckeyemarketplace.com` / `Admin123!`
- Buyer: registered fresh accounts as I went

---

## Strategy

Three layers.

1. Automated unit and component tests run on every push via GitHub Actions
2. One Playwright e2e for the critical browse to checkout path
3. Manual exploratory testing against the deployed app in three browsers and on mobile

I tested against the deployed prod environment, not local. Local was only for fixing things once I'd reproduced them.

---

## Automated coverage

| Layer | Tool | Tests | Status |
|---|---|---|---|
| Backend | xUnit | 9 | All pass |
| Frontend | Vitest + RTL | 13 | All pass |
| E2E | Playwright | 1 | Pass |

These run in CI. Deploy step is gated on tests passing. Red test blocks the deploy.

---

## Functional tests

### Browse
| # | Step | Expected | Result |
|---|---|---|---|
| F1 | Open frontend | 9 seeded products show | Pass |
| F2 | Click a card | Detail view with everything | Pass |
| F3 | Use category filter | Listing filters | Pass |
| F4 | Browse without auth | Public products visible | Pass |

### Account
| # | Step | Expected | Result |
|---|---|---|---|
| F5 | Register valid form | Account made and logged in | Pass |
| F6 | Register dup email | Error shows up | Pass |
| F7 | Login as admin | Admin UI accessible | Pass |
| F8 | Wrong password | 401 with inline error | Pass |
| F9 | Token expires | Refresh fires automatically | Pass |

### Cart
| # | Step | Expected | Result |
|---|---|---|---|
| F10 | Add to cart while logged in | Counter goes up | Pass |
| F11 | Update quantity | Total recalculates | Pass |
| F12 | Remove item | Item disappears | Pass |
| F13 | Add while logged out | Redirects to login | Pass |
| F14 | Reload page | Cart still there | Pass |

### Checkout
| # | Step | Expected | Result |
|---|---|---|---|
| F15 | Place order with address | Order created. Cart cleared | Pass |
| F16 | View order history | Orders listed | Pass |
| F17 | Click an order | Items expand inline | Pass |
| F18 | Empty cart checkout | Blocked with friendly message | Pass |

### Admin
| # | Step | Expected | Result |
|---|---|---|---|
| F19 | Login admin then dashboard | Admin UI accessible. Buyers see 403 | Pass |
| F20 | Create product | Appears in catalog | Pass |
| F21 | Update product | Reflected in listing | Pass |
| F22 | Delete product | Gone from catalog | Pass |
| F23 | View all orders | Full list visible | Pass |
| F24 | Update status | Saved and visible to buyer | Pass |

---

## Cross browser

Manual smoke test of the critical path (browse, register, login, add to cart, checkout) in each browser.

| Browser | Version | Result | Notes |
|---|---|---|---|
| Safari | 17 | Pass | Primary dev browser |
| Chrome | 124 | Pass | No layout differences |
| Firefox | 125 | Pass | Cart sidebar resizing works |

No browser specific issues. App doesn't use anything weird.

---

## Mobile

Tested at two widths.

- iPhone Safari (390px): single column. Header collapses. Cart sidebar moves below the content as a full width section
- iPad sized (768px): multi column grid kept. Cart still side by side

| Area | Result |
|---|---|
| Product grid reflow | Pass |
| Header navigation | Pass |
| Forms (login, register) | Pass |
| Cart sidebar | Pass |
| Checkout form | Pass |
| Admin tables | Acceptable. Horizontal scroll on narrow widths |

First test of mobile was bad. Cart sidebar was eating half the iPhone screen because the layout was a fixed flex row with no breakpoints. Fixed by adding a `responsive.css` with media queries below 768px that stacks the layout and gives the cart full width below the content.

---

## Bugs found and fixed

Real defects from this milestone with the actual fix.

### B1. JWT key too short
Login was returning 500 in prod. Logs said `IDX10720: key has 176 bits, must be at least 256`. The `Jwt:Key` in App Settings was 22 chars (176 bits). HS256 needs 256 bits minimum. Replaced it with a 64 char key. Login worked.

### B2. SQLite migrations on Azure SQL
Backend container kept hitting `ContainerTimeout` and never finishing startup. Existing EF migrations were generated against SQLite. SQL Server can't run those. Switched prod to `EnsureCreated()` and kept `Migrate()` for local. Schema now creates on first prod boot.

### B3. Empty seed data
`/api/products` returned `[]` after deploy. Tables existed but no products. Seed objects had explicit `Id = 1, Id = 2, ...`. SQL Server's IDENTITY column rejects manual ID inserts so `SaveChanges()` threw and the catch swallowed it. Removed the explicit Ids. SQL assigns them automatically. 9 products came back.

### B4. Old sample app files in wwwroot
App Service was serving the default Azure welcome page. Logs: `Expected one .runtimeconfig.json but found 3 (BuckeyeMarketplace.Api, Notes.Api, Notes.Api.Tests)`. Earlier lab deploy had left Notes.Api files in `/site/wwwroot`. Wiped it via Kudu SSH and redeployed only the marketplace API.

### B5. App Service quota exceeded
App got stuck in `QuotaExceeded` state. F1 free tier has a 60 minute daily CPU cap and the failed deploy loop burned through it. Upgraded to B1 Basic. No daily quota.

### B6. Frontend couldn't reach backend
Deployed frontend showed "Failed to load products". Browser console: `ERR_CONNECTION_REFUSED` against `localhost:5062`. The `.env.production` file was in Downloads, not in the project root, so the build used the localhost fallback. Moved both env files into the frontend folder. Refactored `productsApi.ts` to read `import.meta.env.VITE_API_BASE`.

### B7. Vite build failed on test config
`npm run build` errored with `Object literal may only specify known properties, and 'test' does not exist in type 'UserConfigExport'`. The `vite.config.ts` had a `test:` block but imported `defineConfig` from vite which doesn't know vitest options. Switched to `import { defineConfig } from 'vitest/config'` plus a `/// <reference types="vitest" />` directive.

### B8. CI couldn't find the .NET project
Backend workflow failed with `MSB1003: Specify a project or solution file`. Workflow ran `dotnet restore backend/`. The .sln is at the repo root, not inside backend. Pointed dotnet commands at the .sln directly.

### B9. Test project on wrong .NET version
CI test step couldn't load `testhost.dll`. Test project was on net10. API was on net8. Mixed framework references. Downgraded test project to net8 with package versions pinned to 8.0.8.

### B10. Cart sidebar broken on mobile
Cart sidebar took up half the viewport on iPhone. Header text was wrapping awkwardly. Layout was a fixed flex row with no mobile breakpoint. Added `responsive.css` with media queries below 768px. Stacks layout vertically. Cart goes full width below content.

---

## Security checks

- HTTPS enforced on frontend and backend
- JWT signing key 256+ bits stored only in Azure App Settings
- DB connection string in App Service connection strings, not in source
- SQL Server firewall locked to Azure services and the dev machine
- Admin role enforced server side via JWT role claim, not just the UI

---

## Known limits

- B1 plan stays warm but cold starts can still hit after long idle
- `EnsureCreated()` in prod instead of real migrations. Fine for school, not real prod
- No API rate limiting
- Only one Playwright e2e test

---

## Conclusion

All required user and admin flows work in prod. Cross browser passes in Safari, Chrome, Firefox. Mobile responsive after the fix. Ten real bugs found, diagnosed via Azure logs, and fixed before submission. CI runs all tests on every push.

App is ready for the demo.