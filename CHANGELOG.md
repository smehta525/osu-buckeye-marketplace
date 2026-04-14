# Changelog

## Milestone 5

### Added
- register and login endpoints with JWT
- password hashing with PasswordHasher from ASP.NET Core Identity
- password rules (min 8 chars, uppercase and a number)
- email validation on register
- refresh tokens so you dont get logged out after an hour
- [Authorize] on cart and order endpoints
- [Authorize(Roles = "Admin")] on product CRUD and order status
- order placement from cart with a confirmation number
- cart clears after you place an order
- order history scoped to whoever is logged in via JWT
- admin dashboard for managing products and order statuses
- admin user seeded on fresh db
- login and register pages on frontend
- auth context with JWT in localStorage
- protected routes that kick you to login
- token sent on every request automatically
- frontend tries to refresh token on 401 before logging you out
- checkout page with shipping form
- order confirmation page
- logout

### Security fixes
- added [Authorize] to CartController since it was missing
- user ID pulled from JWT claim not from route or body
- JWT key in User Secrets not appsettings
- all queries use LINQ, no raw SQL
- no dangerouslySetInnerHTML in frontend
- HTTPS redirect on