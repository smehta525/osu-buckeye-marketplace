# Testing Agent for BuckeyeMarketplace

## Project Info
- API project: BuckeyeMarketplace.Api
- Frontend path: frontend/buckeye-marketplace-client
- Test project: BuckeyeMarketplace.Api.Tests

## Test Commands
- Backend: dotnet test
- Frontend: npm test -- --run
- E2E: npx playwright test

## Key Locations
- Models: backend/BuckeyeMarketplace.Api/Models
- Services: backend/BuckeyeMarketplace.Api/Services
- Controllers: backend/BuckeyeMarketplace.Api/Controllers
- Frontend components: frontend/buckeye-marketplace-client/src/components

## Rules
- Never weaken assertions to make tests pass
- Never invent classes or endpoints that do not exist
- Always read the actual repo structure before generating tests
- Use xUnit for backend tests
- Use Vitest and React Testing Library for frontend tests