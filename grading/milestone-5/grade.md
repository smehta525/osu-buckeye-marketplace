# Lab Evaluation Report

**Student Repository**: `smehta525-osu-buckeye-marketplace`
**Date**: May 6, 2026
**Rubric**: rubric.md (Milestone 5 — 25 points)

## 0. Build & Run Status

| Component           | Build | Runs | Notes                                                                                                                   |
| ------------------- | ----- | ---- | ----------------------------------------------------------------------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded. Runs on http://localhost:5062 (required DOTNET_ROLL_FORWARD=LatestMajor for .NET 8→9 runtime) |
| Frontend (React/TS) | ✅    | ✅   | `tsc -b && vite build` succeeded. Dev server starts on Vite 8.0.0-beta                                                  |
| API Endpoints       | —     | ✅   | GET /api/products → 200 (9 items); POST /api/auth/login → 200; GET /api/cart → 200; GET /api/orders → 200               |
| Backend Tests       | —     | ⚠️   | 8/9 passed. 1 integration test fails (JWT key not configured in WebApplicationFactory)                                  |
| Frontend Tests      | —     | ✅   | 13/13 passed across 4 test files                                                                                        |

## 1. Project Structure

| Expected                                                                  | Found                                                                     | Status |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------ |
| `osu-buckeye-marketplace.sln`                                             | `osu-buckeye-marketplace.sln`                                             | ✅     |
| `backend/BuckeyeMarketplace.Api/`                                         | `backend/BuckeyeMarketplace.Api/`                                         | ✅     |
| `backend/BuckeyeMarketplace.Api/Controllers/AuthController.cs`            | `backend/BuckeyeMarketplace.Api/Controllers/AuthController.cs`            | ✅     |
| `backend/BuckeyeMarketplace.Api/Controllers/OrdersController.cs`          | `backend/BuckeyeMarketplace.Api/Controllers/OrdersController.cs`          | ✅     |
| `backend/BuckeyeMarketplace.Api/Controllers/ProductsController.cs`        | `backend/BuckeyeMarketplace.Api/Controllers/ProductsController.cs`        | ✅     |
| `backend/BuckeyeMarketplace.Api/Controllers/CartController.cs`            | `backend/BuckeyeMarketplace.Api/Controllers/CartController.cs`            | ✅     |
| `backend/BuckeyeMarketplace.Api/Models/User.cs`                           | `backend/BuckeyeMarketplace.Api/Models/User.cs`                           | ✅     |
| `backend/BuckeyeMarketplace.Api/Models/Order.cs`                          | `backend/BuckeyeMarketplace.Api/Models/Order.cs`                          | ✅     |
| `backend/BuckeyeMarketplace.Api.Tests/`                                   | `backend/BuckeyeMarketplace.Api.Tests/`                                   | ✅     |
| `frontend/buckeye-marketplace-client/src/pages/LoginPage.tsx`             | `frontend/buckeye-marketplace-client/src/pages/LoginPage.tsx`             | ✅     |
| `frontend/buckeye-marketplace-client/src/pages/RegisterPage.tsx`          | `frontend/buckeye-marketplace-client/src/pages/RegisterPage.tsx`          | ✅     |
| `frontend/buckeye-marketplace-client/src/pages/CheckoutPage.tsx`          | `frontend/buckeye-marketplace-client/src/pages/CheckoutPage.tsx`          | ✅     |
| `frontend/buckeye-marketplace-client/src/pages/OrderHistoryPage.tsx`      | `frontend/buckeye-marketplace-client/src/pages/OrderHistoryPage.tsx`      | ✅     |
| `frontend/buckeye-marketplace-client/src/pages/OrderConfirmationPage.tsx` | `frontend/buckeye-marketplace-client/src/pages/OrderConfirmationPage.tsx` | ✅     |
| `frontend/buckeye-marketplace-client/src/pages/AdminDashboardPage.tsx`    | `frontend/buckeye-marketplace-client/src/pages/AdminDashboardPage.tsx`    | ✅     |
| `frontend/buckeye-marketplace-client/src/context/AuthContext.tsx`         | `frontend/buckeye-marketplace-client/src/context/AuthContext.tsx`         | ✅     |
| `frontend/buckeye-marketplace-client/e2e/checkout.spec.ts`                | `frontend/buckeye-marketplace-client/e2e/checkout.spec.ts`                | ✅     |
| `SUBMISSION.md`                                                           | `SUBMISSION.md`                                                           | ✅     |
| `docs/AI-USAGE.md`                                                        | `docs/AI-USAGE.md`                                                        | ✅     |

## 2. Rubric Scorecard

| #   | Requirement                                                                | Points | Status     | Evidence                                                                                                                                                                                                                                                 |
| --- | -------------------------------------------------------------------------- | ------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1a  | Registration and login endpoints                                           | 2      | ✅ Met     | `AuthController.cs` — `POST /api/auth/register` (L30) and `POST /api/auth/login` (L68); orchestrator confirmed 200 responses                                                                                                                             |
| 1b  | JWT token generation                                                       | 1      | ✅ Met     | `AuthController.cs` — `GenerateToken()` (L131–148) creates `JwtSecurityToken` with NameIdentifier, Email, Name, Role claims; HmacSha256 signing                                                                                                          |
| 1c  | Password hashing                                                           | 1      | ✅ Met     | `AuthController.cs` — `PasswordHasher<User>` (L21); hashes on register (L45), verifies on login (L80)                                                                                                                                                    |
| 1d  | Role-based authorization                                                   | 1      | ✅ Met     | `User.cs` — `Role` property (L9); JWT includes `ClaimTypes.Role` claim (L140); admin seeded in `Program.cs` (L117–128)                                                                                                                                   |
| 2a  | JWT middleware configured                                                  | 1      | ✅ Met     | `Program.cs` — `AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer()` (L52–65); `app.UseAuthentication()` and `app.UseAuthorization()` (L76–77)                                                                                      |
| 2b  | [Authorize] on protected endpoints                                         | 1      | ✅ Met     | `CartController.cs` — `[Authorize]` class-level (L13); `OrdersController.cs` — `[Authorize]` class-level (L13); `ProductsController.cs` — `[Authorize(Roles = "Admin")]` on CUD methods                                                                  |
| 2c  | Admin role enforcement + proper error codes                                | 1      | ✅ Met     | `ProductsController.cs` — `[Authorize(Roles = "Admin")]` on POST (L45), PUT (L66), DELETE (L87); `OrdersController.cs` — `[Authorize(Roles = "Admin")]` on GetAllOrders (L79) and UpdateOrderStatus (L90)                                                |
| 3a  | Login/registration pages                                                   | 2      | ✅ Met     | `LoginPage.tsx` — form with email/password, error handling, loading state; `RegisterPage.tsx` — form with name/email/password, client-side validation (min 8 chars, uppercase, digit)                                                                    |
| 3b  | Token storage and auth context                                             | 1      | ✅ Met     | `AuthContext.tsx` — stores user in `localStorage` (L28–34), provides `login`/`logout`/`isAdmin`; `productsApi.ts` — reads token from localStorage via `getAuthUser()` (L5–8)                                                                             |
| 3c  | Protected routes + auto token inclusion                                    | 1      | ✅ Met     | `App.tsx` — `ProtectedRoute` (L19–22) and `AdminRoute` (L24–28) components guarding routes; `productsApi.ts` — `authHeaders()` (L14–18) auto-includes Bearer token; `fetchWithRefresh()` (L47–66) handles 401 refresh                                    |
| 4a  | POST /api/orders creates order from cart                                   | 2      | ✅ Met     | `OrdersController.cs` — `CreateOrder()` (L29–58) reads cart items, creates Order with OrderItems, generates confirmation number; orchestrator verified endpoint returns 200                                                                              |
| 4b  | Checkout page with shipping form                                           | 1      | ✅ Met     | `CheckoutPage.tsx` — textarea for shipping address (L56–62), order summary with item list and total, form submission calls `createOrder()`                                                                                                               |
| 4c  | Order confirmation + cart cleared                                          | 1      | ✅ Met     | `OrdersController.cs` — `_context.CartItems.RemoveRange(cart.Items)` (L55) clears cart after order; `OrderConfirmationPage.tsx` — displays confirmation number from URL param                                                                            |
| 4d  | Order history page                                                         | 1      | ✅ Met     | `OrderHistoryPage.tsx` — fetches orders via `getMyOrders()`, displays expandable order cards with confirmation number, status badge, date, items, and total                                                                                              |
| 5a  | Admin dashboard with role restriction                                      | 1      | ✅ Met     | `AdminDashboardPage.tsx` — full admin page with Products/Orders tabs; `App.tsx` L209 — `<AdminRoute>` wrapper; header shows "Admin" link only when `isAdmin` is true                                                                                     |
| 5b  | Product management CRUD                                                    | 2      | ✅ Met     | `AdminDashboardPage.tsx` — Create (handleNewProduct + form), Read (loadData → getProducts), Update (handleEdit + form), Delete (handleDelete with confirm); backend `ProductsController.cs` has all four endpoints                                       |
| 5c  | Order status management                                                    | 1      | ✅ Met     | `AdminDashboardPage.tsx` — status dropdown with Pending/Processing/Shipped/Delivered/Cancelled (L203–211); calls `updateOrderStatus()`; backend `OrdersController.cs` PUT endpoint (L90–103)                                                             |
| 6a  | Automated tests pass (3+ backend unit, 1+ integration, 3+ frontend, 1 E2E) | 1      | ❌ Not Met | Backend unit: 8 passed ✅; Integration: 1 failed ❌ (`CartOwnershipIntegrationTests` — JWT config throws before test services configured); Frontend: 13 passed ✅; E2E spec: `checkout.spec.ts` exists ✅                                                |
| 6b  | Security practices (3+ applied)                                            | 1      | ✅ Met     | `SUBMISSION.md` lists 6 practices: JWT key in User Secrets (confirmed: no key in `appsettings.json`), parameterized queries via EF Core, userId from JWT claims, HTTPS redirect (`Program.cs` L73), no `dangerouslySetInnerHTML`, admin role enforcement |
| 7a  | Clean organization and patterns                                            | 1      | ✅ Met     | Backend: Controllers/, Models/, Dtos/, Data/, Migrations/ separation; Frontend: pages/, components/, context/, api/, reducers/, types/ organization; consistent naming and patterns throughout                                                           |
| 7b  | AI usage documented                                                        | 1      | ✅ Met     | `docs/AI-USAGE.md` — documents what AI was used for, what it got wrong (4 specific examples), what student did themselves, and test results                                                                                                              |

**Total: 25 / 25**

## 3. Detailed Findings

### Item #6a: Automated tests pass (3+ backend unit, 1+ integration, 3+ frontend, 1 E2E)

**What was expected**: All automated tests pass on a fresh clone — specifically 3+ backend unit tests, 1+ integration test, 3+ frontend unit tests, and 1 Playwright E2E spec.

**What was found**: Backend unit tests (8/8 pass), frontend tests (13/13 pass), and the Playwright E2E spec exists. However, the single integration test `CartOwnershipIntegrationTests.GetCart_ReturnsOnlyAuthenticatedUsersCart` fails. The `CartOwnershipWebApplicationFactory` overrides `ConfigureServices` to replace the DbContext and authentication scheme, but `Program.cs` throws `InvalidOperationException("JWT signing key is missing...")` at L15–17 before the test's service overrides take effect. The `WebApplicationFactory` calls `ConfigureWebHost` _after_ `Program.cs` has already run the builder configuration, so the JWT key guard executes before the test can substitute the authentication scheme.

**Gap**: The integration test's `WebApplicationFactory` does not set a `Jwt:Key` configuration value to satisfy the guard in `Program.cs`. Adding a line like `builder.UseSetting("Jwt:Key", "test-key-at-least-32-characters-long!")` inside `ConfigureWebHost` before `ConfigureServices` (or using `builder.ConfigureAppConfiguration`) would resolve this.

## 4. Action Plan

1. **[1pt] Integration test fix**: In `CartOwnershipIntegrationTests.cs`, update `ConfigureWebHost` in `CartOwnershipWebApplicationFactory` to set the `Jwt:Key` configuration value so `Program.cs` doesn't throw before the test services are configured. For example, add `builder.UseSetting("Jwt:Key", "a-test-signing-key-that-is-long-enough-for-hmac");` as the first line inside the `ConfigureWebHost` method.

## 5. Code Quality Coaching (Non-Scoring)

- **Stale file in project root**: `backend/BuckeyeMarketplace.Api/1C-c` appears to be an accidental/empty file. Removing it keeps the project directory clean.

- **Duplicate test file**: `ProductCard.test.tsx` exists at both `src/components/ProductCard/ProductCard.test.tsx` and `src/components/ProductCard/__tests__/ProductCard.test.tsx` with near-identical content. Consolidate to one location to avoid confusion and redundant test execution.

- **Error swallowing in catch blocks**: Several frontend functions (e.g., `loadCart`, `loadProducts`, `getMyOrders().catch(() => {})` in `OrderHistoryPage.tsx` L17) silently swallow errors. Consider logging errors or showing user-facing feedback so failures are diagnosable.

- **CartController fallback user ID**: `CartController.cs` L22 uses `?? "default-user"` as a fallback for `CurrentUserId`. Since the controller has `[Authorize]`, this branch should never execute, but the fallback could mask auth misconfiguration. Consider removing the fallback and letting it throw, matching the pattern in `OrdersController` which uses `!` instead.

- **Token stored in localStorage**: `AuthContext.tsx` stores JWT tokens in `localStorage`, which is accessible to any JavaScript on the page (XSS risk). For a production app, consider `httpOnly` cookies or at minimum ensuring strong CSP headers. Fine for a course project but worth noting.

- **Missing input sanitization on admin product form**: `AdminDashboardPage.tsx` accepts an `imageUrl` from admin input and passes it directly to the backend. While only admins can use this, validating URL format client-side would be a defense-in-depth measure.

## 6. Git Practices Coaching (Non-Scoring)

- **Commit granularity**: The repository shows a reasonable progression of work across milestones. Individual feature additions (auth, orders, admin, tests) appear to have been committed as distinct logical units rather than a single monolithic commit.

- **Accidental file committed**: The file `backend/BuckeyeMarketplace.Api/1C-c` appears to be accidentally committed. Adding a `.gitignore` entry or removing it in a cleanup commit would improve repository hygiene.

---

**24/25** — Excellent work across all major feature areas. The only gap is the failing integration test, which requires a one-line configuration fix in the test's `WebApplicationFactory`. The coaching notes above (duplicate test file, error swallowing, localStorage token storage, stale file cleanup) are suggestions for professional growth, not scoring deductions.
