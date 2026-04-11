## Lab: AI-Assisted Security, QA & Testing Workshop

### Prompt used with Testing Agent
"Read TESTING-AGENT.md and my repo structure, then tell me the best candidates for 3 backend unit tests, 1 backend integration test, 3 frontend unit tests, and 1 E2E happy-path test."

### One thing Copilot got wrong
Copilot hardcoded the cart assertion to expect exactly 1 item, but the cart already had persisted items. I caught it and had it fix the assertion to be relative to the starting cart state.

### Test commands and results
- dotnet test: 9 passed
- npm test -- --run: 13 passed
- npx playwright test: 1 passed

### Quality self-check
- Functionality: cart, products, and checkout flow all working
- Security: JWT key in User Secrets, userId from JWT claims not route/body
- Code quality: no raw SQL, no dangerouslySetInnerHTML, CORS configured correctly