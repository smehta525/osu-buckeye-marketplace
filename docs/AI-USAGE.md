# AI Usage

## Milestone 5

Used Claude and Copilot a lot for this milestone. Heres what they helped with and where I had to fix stuff.

### What I used AI for
- JWT auth setup with register and login
- Order and OrderItem models and the OrdersController
- putting [Authorize] on controllers
- frontend pages (login, register, checkout, order history, admin)
- auth context and protected routes
- refresh token stuff
- fixing tests after the auth changes broke them
- generating the Playwright E2E spec
- writing the submission docs

### What they got wrong
- Copilot hardcoded a cart assertion expecting 1 item but there was already data in the cart. had to make it relative
- Playwright spec blew up with a strict mode error because $15.00 showed up twice on the page. fixed with .first()
- old tests called GetAll and GetById but the new controller uses GetProducts and GetProduct. had to rename
- Claude forgot [Authorize] on CartController so the cart was wide open. caught it going through the rubric

### What I did myself
- tested the whole flow manually on two laptops
- ran git grep to make sure no secrets got committed
- decided against adding forgot password since its not in the rubric
- kept landing page as product list instead of login because thats how real sites work
- verified register flow works with a fresh account

### Test results
- dotnet test: 9 passed
- npm test -- --run: 13 passed
- npx playwright test: 1 passed

---

## Lab: AI-Assisted Security, QA & Testing Workshop

### Prompt used with Testing Agent
"Read TESTING-AGENT.md and my repo structure, then tell me the best candidates for 3 backend unit tests, 1 backend integration test, 3 frontend unit tests, and 1 E2E happy-path test."

### One thing Copilot got wrong
hardcoded the cart assertion to expect exactly 1 item but the cart had persisted items. had it fix the assertion to be relative

### Test commands and results
- dotnet test: 9 passed
- npm test -- --run: 13 passed
- npx playwright test: 1 passed

### Quality self-check
- cart, products and checkout flow all working
- JWT key in User Secrets, userId from JWT claims not route/body
- no raw SQL, no dangerouslySetInnerHTML, CORS set up right