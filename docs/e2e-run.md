# E2E Test Run

## Prompts I gave the agent

first asked it to run through the checkout flow manually:
 "Run this flow: log in, browse products, add item to cart, go to checkout, place order, verify confirmation, check order history. Snapshot after each major step. Stop and report if anything fails."

then asked it to make an actual spec:
 "Generate a Playwright spec for the happy path: register, login, browse, add to cart, checkout, view order in history. Use getByRole and getByLabel."

## What failed

strict mode violation on the order history page. two elements matched $15.00 (a span and a strong tag) so Playwright didnt know which one to check.

also the old spec didnt work anymore because adding to cart requires login now.

## What I fixed

- added .first() to the $15.00 check
- rewrote the spec to register and login before doing anything
- used Date.now() in the email so reruns dont conflict with existing users

## Result

```
npx playwright test
1 passed
```