# Milestone 5 Submission

## Test Credentials

Regular user: shreyam@gmail.com / Shreya123

Admin user (seeded): admin@buckeyemarketplace.com / Admin123!

## Security Practices

1. JWT key is in User Secrets so it doesnt end up in the repo

2. All queries go through EF Core and LINQ so everything is parameterized. No raw SQL anywhere

3. User ID comes from the JWT claim, not from the URL or body. Cart and order queries are scoped to whoever is logged in

4. HTTPS redirect is turned on in Program.cs

5. No dangerouslySetInnerHTML in the frontend. React handles escaping

6. Admin routes use [Authorize(Roles = "Admin")] so regular users cant hit them

## AI Usage

See [docs/AI-USAGE.md](docs/AI-USAGE.md)