# Lab Evaluation Report

**Student Repository**: `smehta525/osu-buckeye-marketplace`
**Date**: 2026-03-23
**Rubric**: rubric.md

## 1. Build & Run Status

| Component           | Build | Runs | Notes                                                                        |
| ------------------- | ----- | ---- | ---------------------------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded. Server starts on `http://localhost:5062`.           |
| Frontend (React/TS) | ✅    | ✅   | `tsc -b && vite build` succeeded. Vite dev server starts on port 5173.       |
| API Endpoints       | —     | ✅   | All endpoints tested and responding correctly (see below).                   |

### API Endpoint Test Results

| Endpoint                    | HTTP Status | Result                                                   |
| --------------------------- | ----------- | -------------------------------------------------------- |
| `GET /api/products`         | 200         | Returns JSON array of 9 products with correct shape      |
| `GET /api/products/1`       | 200         | Returns single product (title: "Heels")                  |
| `GET /api/products/999`     | 404         | Correctly returns 404 for non-existent ID                |

### Project Structure Comparison

| Expected    | Found       | Status |
| ----------- | ----------- | ------ |
| `/backend`  | `/backend`  | ✅     |
| `/frontend` | `/frontend` | ✅     |
| `/docs`     | `/docs`     | ✅     |

## 2. Rubric Scorecard

| #   | Requirement                          | Points | Status  | Evidence                                                                                                                                                                                                                                                   |
| --- | ------------------------------------ | ------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | React Product List Page              | 5      | ✅ Met  | `ProductListPage.tsx` — handles loading (L8, L31–33), error (L9, L35–37), and empty states (L39–41). Uses `ProductList` → `ProductCard` component hierarchy. All fields rendered in `ProductCard.tsx` (title, id, description, price, category, seller, date, image). |
| 2   | React Product Detail Page            | 5      | ✅ Met  | `ProductDetailPage.tsx` — separate route at `/products/:id` (`App.tsx` L9). All fields displayed (L51–68). "Back to products" link (L48–50) for list ↔ detail navigation. `ProductCard.tsx` wraps each card in `<Link to={/products/${id}}>` for list → detail. |
| 3   | API Endpoint: GET /api/products      | 5      | ✅ Met  | `ProductsController.cs` L118–121 — `GetAll()` returns `Ok(Products)`. In-memory `List<Product>` data store (L12–116). Verified: returns 200 with JSON array of 9 products.                                                                                |
| 4   | API Endpoint: GET /api/products/{id} | 5      | ✅ Met  | `ProductsController.cs` L124–131 — `GetById(int id)` with `[HttpGet("{id:int}")]`. Returns 404 with message for unknown ID (L128). Verified: 200 for id=1, 404 for id=999.                                                                                |
| 5   | Frontend-to-API Integration          | 5      | ✅ Met  | `productsApi.ts` — `getProducts()` and `getProductById()` fetch from `http://127.0.0.1:5062/api/products`. No hardcoded data in components. Error state handled in both `ProductListPage.tsx` (L9, L35–37) and `ProductDetailPage.tsx` (L13, L38).         |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **Typo in filename**: `ProductLIst.css` — the CSS file for the ProductList component has a capital "I" in "LIst". This should be `ProductList.css` for consistency. While it works on case-insensitive filesystems (macOS default), it would break on case-sensitive systems (Linux/CI).

- **HTTPS redirection in development**: `Program.cs` L33 — `app.UseHttpsRedirection()` is enabled but the dev profile uses HTTP only (port 5062). This causes a redirect that can confuse API clients. Consider wrapping it in a production-only check or removing it if HTTPS is not used.

- **String-typed date field**: `Product.cs` L10 — `PostedDate` is typed as `string` rather than `DateTime` or `DateOnly`. Using a proper date type would enable sorting, validation, and consistent serialization.

- **Inline styles on detail page**: `ProductDetailPage.tsx` — uses inline `style={{ }}` objects for layout. Consider extracting these into a CSS file (like the other components do) for consistency and maintainability.

- **No environment-specific API URL validation**: `productsApi.ts` L4 — the fallback URL `http://127.0.0.1:5062` is hardcoded. This is fine for development but consider documenting the `VITE_API_BASE_URL` environment variable in the README for deployment scenarios.

## 6. Git Practices Coaching (Non-Scoring)

- **Single commit for all Milestone 3 work**: The entire backend API, frontend pages, components, API integration, and styling appear to have been committed in a single commit (`d0bb41e Initial Post`). Breaking work into smaller, incremental commits (e.g., one for the API, one for the list page, one for the detail page, one for integration) makes it easier to review, debug, and revert changes.

- **Commit message clarity**: Messages like "Initial Post" and "Updated README" are vague. More descriptive messages such as "Add GET /api/products endpoint with in-memory data store" or "Implement ProductListPage with loading and error states" communicate intent and make the history more useful.

---

**25/25** — All rubric requirements are fully met. The coaching notes above (filename typo, HTTPS redirect, date typing, inline styles, git practices) are suggestions for professional growth, not scoring deductions.
