# Lab Evaluation Report

**Student Repository**: `smehta525-osu-buckeye-marketplace`  
**Date**: May 6, 2026  
**Rubric**: `grading/milestone-4/rubric.md`

## 0. Build & Run Status

| Component           | Build | Runs | Notes                                                                                                                   |
| ------------------- | ----- | ---- | ----------------------------------------------------------------------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded. Runs on http://localhost:5062 (required DOTNET_ROLL_FORWARD=LatestMajor for .NET 8→9 runtime) |
| Frontend (React/TS) | ✅    | ✅   | `tsc -b && vite build` succeeded. Dev server starts on Vite 8.0.0-beta                                                  |
| API Endpoints       | —     | ✅   | GET /api/products → 200 (9 items); POST /api/auth/login → 200; GET /api/cart → 200; GET /api/orders → 200               |
| Backend Tests       | —     | ⚠️   | 8/9 passed. 1 integration test fails (JWT key not configured in WebApplicationFactory)                                  |
| Frontend Tests      | —     | ✅   | 13/13 passed across 4 test files                                                                                        |

## 1. Project Structure

| Component              | Expected                        | Found                                                                                                                                                                                                                                                  | Status |
| ---------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| Backend project        | .NET API project                | [BuckeyeMarketplace.Api.csproj](backend/BuckeyeMarketplace.Api/BuckeyeMarketplace.Api.csproj)                                                                                                                                                          | ✅     |
| Frontend project       | React/TypeScript app            | [package.json](frontend/buckeye-marketplace-client/package.json)                                                                                                                                                                                       | ✅     |
| Cart controller        | `Controllers/CartController.cs` | [CartController.cs](backend/BuckeyeMarketplace.Api/Controllers/CartController.cs)                                                                                                                                                                      | ✅     |
| Cart model             | `Models/Cart.cs`                | [Cart.cs](backend/BuckeyeMarketplace.Api/Models/Cart.cs)                                                                                                                                                                                               | ✅     |
| CartItem model         | `Models/CartItem.cs`            | [CartItem.cs](backend/BuckeyeMarketplace.Api/Models/CartItem.cs)                                                                                                                                                                                       | ✅     |
| Cart DTOs              | Request/Response DTOs           | [CartResponseDto.cs](backend/BuckeyeMarketplace.Api/Dtos/CartResponseDto.cs), [AddToCartRequest.cs](backend/BuckeyeMarketplace.Api/Dtos/AddToCartRequest.cs), [UpdateCartItemRequest.cs](backend/BuckeyeMarketplace.Api/Dtos/UpdateCartItemRequest.cs) | ✅     |
| Cart reducer           | `reducers/cartReducer.ts`       | [cartReducer.ts](frontend/buckeye-marketplace-client/src/reducers/cartReducer.ts)                                                                                                                                                                      | ✅     |
| Cart sidebar component | `components/CartSidebar/`       | [CartSidebar.tsx](frontend/buckeye-marketplace-client/src/components/CartSidebar/CartSidebar.tsx)                                                                                                                                                      | ✅     |
| API service layer      | `api/productsApi.ts`            | [productsApi.ts](frontend/buckeye-marketplace-client/src/api/productsApi.ts)                                                                                                                                                                           | ✅     |
| EF Migrations          | `Migrations/`                   | [Migrations/](backend/BuckeyeMarketplace.Api/Migrations) (3 migrations)                                                                                                                                                                                | ✅     |
| AI usage docs          | `docs/AI-USAGE.md`              | [AI-USAGE.md](docs/AI-USAGE.md)                                                                                                                                                                                                                        | ✅     |

## 2. Rubric Scorecard

| #   | Requirement                              | Points | Status | Evidence                                                                                                                                                                                                                                                                                                                                                        |
| --- | ---------------------------------------- | ------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1a  | useReducer or Context API for cart state | 2      | ✅ Met | [App.tsx](frontend/buckeye-marketplace-client/src/App.tsx#L39) — `useReducer(cartReducer, null)` with [cartReducer.ts](frontend/buckeye-marketplace-client/src/reducers/cartReducer.ts) handling `SET_CART` and `CLEAR` actions                                                                                                                                 |
| 1b  | Add, update quantity, remove operations  | 2      | ✅ Met | [App.tsx](frontend/buckeye-marketplace-client/src/App.tsx#L98-L128) — `handleAddToCart`, `handleUpdateQuantity`, `handleRemoveItem`, `handleClearCart` all dispatch through reducer                                                                                                                                                                             |
| 1c  | Cart count in header + calculated totals | 1      | ✅ Met | [App.tsx](frontend/buckeye-marketplace-client/src/App.tsx#L146) — header shows `cart?.itemCount ?? 0` items and `cart?.cartTotal`; [CartSidebar.tsx](frontend/buckeye-marketplace-client/src/components/CartSidebar/CartSidebar.tsx#L73) shows per-item subtotals and cart total                                                                                |
| 2a  | GET /api/cart                            | 1      | ✅ Met | [CartController.cs](backend/BuckeyeMarketplace.Api/Controllers/CartController.cs#L27) — `[HttpGet]` returns `CartResponseDto` with items; verified 200 by orchestrator                                                                                                                                                                                          |
| 2b  | POST /api/cart (add item)                | 1      | ✅ Met | [CartController.cs](backend/BuckeyeMarketplace.Api/Controllers/CartController.cs#L43) — `[HttpPost]` accepts `AddToCartRequest`, creates cart if needed, increments existing items, returns `CreatedAtAction`                                                                                                                                                   |
| 2c  | PUT /api/cart/{cartItemId} (update qty)  | 1      | ✅ Met | [CartController.cs](backend/BuckeyeMarketplace.Api/Controllers/CartController.cs#L91) — `[HttpPut("{cartItemId:int}")]` updates quantity, returns Ok with updated cart                                                                                                                                                                                          |
| 2d  | DELETE endpoints (item + clear)          | 1      | ✅ Met | [CartController.cs](backend/BuckeyeMarketplace.Api/Controllers/CartController.cs#L112-L142) — `[HttpDelete("{cartItemId:int}")]` removes single item; `[HttpDelete("clear")]` removes all items                                                                                                                                                                 |
| 2e  | Proper status codes and responses        | 1      | ✅ Met | GET→200/404, POST→201 (`CreatedAtAction`), PUT→200/404, DELETE→204/404; all return structured JSON error objects                                                                                                                                                                                                                                                |
| 3a  | Cart/CartItem EF entities                | 2      | ✅ Met | [Cart.cs](backend/BuckeyeMarketplace.Api/Models/Cart.cs) — `Id`, `UserId`, `Items` collection; [CartItem.cs](backend/BuckeyeMarketplace.Api/Models/CartItem.cs) — `Id`, `CartId`, `ProductId`, `Quantity` with navigation properties                                                                                                                            |
| 3b  | Relationships and navigation properties  | 1      | ✅ Met | [BuckeyeMarketplaceContext.cs](backend/BuckeyeMarketplace.Api/Data/BuckeyeMarketplaceContext.cs#L22-L30) — Fluent API configures `CartItem→Cart` (one-to-many) and `CartItem→Product` (many-to-one) with foreign keys                                                                                                                                           |
| 3c  | Migrations applied, data persists        | 1      | ✅ Met | Three migrations present in [Migrations/](backend/BuckeyeMarketplace.Api/Migrations) including `InitialCreate`; orchestrator confirmed GET /api/cart returns persisted data                                                                                                                                                                                     |
| 4a  | Real API replaces mock/localStorage      | 2      | ✅ Met | [productsApi.ts](frontend/buckeye-marketplace-client/src/api/productsApi.ts#L113-L153) — all cart functions (`getCart`, `addToCart`, `updateCartItem`, `removeCartItem`, `clearCart`) call `${API_BASE}/cart` endpoints; no mock data or localStorage for cart                                                                                                  |
| 4b  | All cart operations call API             | 2      | ✅ Met | [App.tsx](frontend/buckeye-marketplace-client/src/App.tsx#L84-L128) — `loadCart()` calls `getCart()`, `handleAddToCart` calls `addToCart()`, `handleUpdateQuantity` calls `updateCartItem()`, `handleRemoveItem` calls `removeCartItem()`, `handleClearCart` calls `clearCart()`                                                                                |
| 4c  | State synchronization                    | 1      | ✅ Met | All API responses dispatch `SET_CART` to the reducer; delete operations re-fetch the full cart via `loadCart()` to ensure sync                                                                                                                                                                                                                                  |
| 5a  | Loading states                           | 1      | ✅ Met | [App.tsx](frontend/buckeye-marketplace-client/src/App.tsx#L40-L41) — `loadingProducts` and `loadingCart` state; [ProductListPage.tsx](frontend/buckeye-marketplace-client/src/pages/ProductListPage.tsx#L25) — "Loading products..."; [CartSidebar.tsx](frontend/buckeye-marketplace-client/src/components/CartSidebar/CartSidebar.tsx#L55) — "Loading cart..." |
| 5b  | Error messages and edge cases            | 1      | ✅ Met | [App.tsx](frontend/buckeye-marketplace-client/src/App.tsx#L42) — global `error` state rendered as `error-message`; each handler catches errors with descriptive messages; empty cart handled gracefully; unauthenticated add-to-cart redirects to login                                                                                                         |
| 5c  | Success feedback                         | 1      | ✅ Met | [Toast.tsx](frontend/buckeye-marketplace-client/src/components/Toast/Toast.tsx) — animated toast notification with checkmark; triggered on add-to-cart via `triggerToast()` at [App.tsx](frontend/buckeye-marketplace-client/src/App.tsx#L101)                                                                                                                  |
| 6a  | Clean component structure                | 1      | ✅ Met | Components organized in folders (`CartSidebar/`, `ProductCard/`, `ProductList/`, `Toast/`); pages in `pages/`; types in `types/`; reducers in `reducers/`; API in `api/`                                                                                                                                                                                        |
| 6b  | Service layer / custom hooks             | 1      | ✅ Met | [productsApi.ts](frontend/buckeye-marketplace-client/src/api/productsApi.ts) — dedicated API service layer with `fetchWithRefresh` wrapper, auth header injection, and organized sections for Auth, Products, Cart, Orders                                                                                                                                      |
| 6c  | AI usage documented                      | 1      | ✅ Met | [AI-USAGE.md](docs/AI-USAGE.md) — documents tools used, what AI helped with, what it got wrong, and what student did manually; [AI_REFLECTION.md](AI_REFLECTION.md) — detailed per-milestone reflection                                                                                                                                                         |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **Reducer simplicity**: [cartReducer.ts](frontend/buckeye-marketplace-client/src/reducers/cartReducer.ts) — The reducer only handles `SET_CART` and `CLEAR`, with all logic in the API layer. This works but means the reducer adds indirection without real state reduction logic. Consider whether the reducer pattern is earning its keep versus a simple `useState` for this use case, or add optimistic update actions (`ADD_ITEM`, `UPDATE_ITEM`, `REMOVE_ITEM`) to make it more meaningful.

- **Error state never clears**: [App.tsx](frontend/buckeye-marketplace-client/src/App.tsx#L42) — Once `setError(...)` is called, the error banner stays visible until page reload. Consider clearing it on the next successful operation or adding a dismiss button.

- **Type assertion on null cart**: [App.tsx](frontend/buckeye-marketplace-client/src/App.tsx#L87) — `payload: null as any` in the catch block of `loadCart` bypasses type safety. A cleaner approach would be dispatching `{ type: "CLEAR" }` instead.

- **No input validation on quantity controls**: [CartSidebar.tsx](frontend/buckeye-marketplace-client/src/components/CartSidebar/CartSidebar.tsx#L68-L70) — The minus button calls `onUpdateQuantity(item.id, item.quantity - 1)` which can reach 0. The guard is in `App.tsx` (`if (quantity < 1) return`), but the button should ideally be disabled at quantity 1 to avoid a silent no-op.

## 6. Git Practices Coaching (Non-Scoring)

- **Incremental commits**: The CHANGELOG shows distinct milestones with clear feature groupings, suggesting reasonable commit practices across the project lifecycle.

- **Documentation alongside code**: AI usage documentation is thorough and honest about what AI got wrong, which is a good professional practice for transparency and reproducibility.

---

**25/25** — All rubric requirements are fully met with strong implementation across cart state management, API endpoints, database persistence, frontend-backend integration, error handling/UX, and code quality. The coaching notes above (reducer design, error clearing, type safety, button state) are suggestions for professional growth, not scoring deductions.
