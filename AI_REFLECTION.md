# AI Tool Reflection

**Project:** Buckeye Marketplace, Milestone 6
**Author:** Shreya Mehta
**Date:** April 30, 2026

---

## How I used each tool

I leaned on two AI tools across the whole project. **GitHub Copilot** lived in VS Code and handled small stuff (function signatures, autocomplete, stub tests). **Claude** was the longer chat partner I used for bigger changes, debugging, and design questions. I tried ChatGPT in M3 but switched to Claude after that and didn't go back. Claude held context way better and produced code that didn't drift between front and back.

By M5 I had a real workflow. Plan a milestone with Claude before writing any code. Implement with Claude and Copilot in parallel. Then ask Claude to check my work against the rubric before submitting.

---

## How AI fit each phase

### Planning (M1, M2)
Used Claude to brainstorm user personas and the buyer journey. One thing I remember: I asked Claude to list fields a buyer would need to make a decision and it surfaced "posted date" which I'd missed. That ended up on every product card.

### Implementation (M3, M4, M5)

**M3 (catalog).** ChatGPT scaffolded the React product list and .NET controllers. Worked but lost context across long sessions and produced subtle mismatches between frontend types and backend DTOs.

**M4 (cart).** Switched to Claude. It did the React Router migration, the useState to useReducer rewrite, and a full redesign of the cart sidebar UI when I just asked for "cleaner than what I have". The EF migration from in memory to SQLite went smoothly because I could paste my Program.cs and DbContext together and Claude saw the full picture.

**M5 (auth and orders).** Claude scaffolded the JWT pipeline including refresh tokens, admin role enforcement on protected endpoints, and the orders feature. It also caught a security mistake. My first pass stored only the JWT in localStorage. Claude pointed out that without a refresh token I'd be forcing users to re login every 15 minutes.

### Testing (M5, M6)
Claude wrote the initial xUnit scaffolding for controllers and an integration test using `WebApplicationFactory`. I wrote my own assertions on top. For Playwright, Claude helped me get past a selector issue where my `data-testid` attributes weren't being picked up consistently.

### Deployment (M6)
This was the most hands on AI session by far. Deploying to Azure surfaced a long chain of problems and Claude debugged each one as logs came in.

The JWT key length crash. Login was returning 500 in prod. I tailed App Service logs, pasted the stack trace into Claude, and it identified `IDX10720: key has 176 bits, must be at least 256` immediately. One env var change fixed it.

The SQLite vs SQL Server migration thing. Container kept timing out on startup. Claude diagnosed that EF was trying to run SQLite migrations against Azure SQL and proposed `EnsureCreated()` in prod with `Migrate()` for local. Right tradeoff for a school project.

CI workflow. Backend workflow was failing with `MSB1003: Specify a project or solution file`. Claude pointed out that `dotnet restore backend/` doesn't work because the solution file is at the repo root. Three lines changed and CI went green.

---

## Specific examples

**Prompt:** "Here is my CartController. Clean it up and make sure all five endpoints have the right HTTP status codes."
**Outcome:** Got the controller back with correct `[ProducesResponseType]` attributes. Claude also caught that I was returning `Ok()` on a successful create instead of `CreatedAtAction()`.

**Prompt:** "Switch my project from UseInMemoryDatabase to SQLite with EF Core migrations. Here is my Program.cs and my context file."
**Outcome:** Right configuration, right migration commands, and a reminder to gitignore `marketplace.db`. Worked first try.

**Prompt:** "Login is returning 500 in prod. Logs show IDX10720. Key has 176 bits, must be at least 256. Fix?"
**Outcome:** Diagnosed instantly. HS256 needs 32+ chars. Suggested a 64 char replacement. One Azure CLI command and login worked.

**Prompt:** ".NET app is failing to start in App Service with ContainerTimeout. Logs show 'Expected to find only one .runtimeconfig.json but found 3'. How do I fix?"
**Outcome:** Diagnosed leftover sample app files in `/site/wwwroot` from a lab. Walked me through wiping it via Kudu SSH and redeploying. Fixed.

---

## What worked well

**Pasting actual code and actual error logs.** AI quality jumped when I gave Claude the real stack trace instead of paraphrasing the symptom. "It's broken" got generic guesses. Pasting `IDX10720: ...` got the right answer in one shot.

**Iteration over single shot.** I almost never used the first response untouched. The pattern of "try this", "didn't work, here's the new error", "try this instead" was way more productive than expecting one perfect answer.

**AI as a debugging rubber duck.** Even when Claude was wrong, the act of explaining the problem to it forced me to be specific, and that specificity often surfaced the bug myself.

**Asking for a rubric review.** Before submitting each milestone I'd paste the rubric and my work and ask "what's missing?" Caught real gaps every time.

---

## What didn't work

**Subtle environment differences.** Claude initially gave me a Program.cs that worked on .NET 10 (my local) but my Azure App Service was running .NET 8. Builds passed locally and broke in CI. AI didn't catch that the deployed runtime might differ from local. I had to figure that out from logs.

**Inventing API surfaces.** Copilot would happily autocomplete imports for libraries that didn't exist or method names that didn't match the version I had installed. A few times I had to delete what it suggested and look up the real API.

**Long context drift.** Across very long sessions Claude would sometimes forget earlier decisions. I'd settle on localStorage for tokens early on and 50 messages later it would suggest cookies. Re grounding at the start of long sessions helped.

**Over eager refactors.** Asked to fix a small thing, AI would sometimes propose rewriting an entire file. I learned to be specific. "Change only the seed block. Leave everything else alone."

**Confidently wrong fixes.** A few times Claude gave a confident fix that didn't actually solve the root cause. The IDENTITY column seed bug took two passes. First try removed the seed entirely. Second try was the right fix (drop the explicit `Id =` properties, keep the seed).

---

## Productivity and learning

Hard to put a number on the productivity gain but I'd guess this project would have taken 1.5x to 2x longer without AI. Biggest wins were in M6 deployment where I might have spent hours figuring out the SQLite vs SQL Server thing from scratch. The first try success rate on small tasks (controllers, EF setup, JWT plumbing) was high. The bigger payoff was that the debugging loop dropped from hours to minutes.

Learning was a mixed bag. The risk with AI is becoming a copy paster who doesn't understand the code. I tried to push back on that by reading every diff before committing it, asking why when something seemed off, and doing my own research alongside.

I learned things from AI that I might not have picked up otherwise. The difference between `EnsureCreated()` and `Migrate()`. Why JWT keys have minimum bit length requirements. How Azure App Service connection strings differ from app settings. The GitHub Actions context syntax. Those are real concepts now, not just code I copy pasted.

---

## Lessons learned

**AI is fastest when the problem is well scoped.** "Write me a CartController with these five endpoints" works much better than "make my project better".

**Always paste the real error.** Vague descriptions get vague answers. Stack traces and log lines get specific answers.

**AI is a force multiplier, not a replacement.** It accelerates a developer who knows what they want. It amplifies confusion in a developer who doesn't. The hours I spent doing my own research at the start paid off when I had to evaluate AI suggestions critically.

**Verify, don't trust.** Especially for deployment, security, and data integrity, I checked everything against documentation or by running the code myself.

**The conversation matters more than the prompt.** I used to think prompt engineering meant writing one perfect message. In practice the most useful sessions were multi turn. The "perfect prompt" was usually message 4 or 5 in a thread, not message 1.

**Trust your gut when AI and you disagree.** A few times Claude suggested things that didn't feel right (consolidating components into one big file, switching to cookies). When I pushed back the AI usually agreed there were tradeoffs. My instinct was right at least as often as Claude's was.

---

## Final thoughts

If this project had been pre AI it would have looked very different. Probably narrower in scope (no JWT auth, no real CI/CD, no production deploy) or stretched over many more weekends. AI made it realistic to ship a full stack production app with auth, admin features, automated tests, and CI/CD inside one semester.

But AI was a tool, not a teacher. The understanding came from reading the code, breaking things, fixing them, and asking why until I knew the answer. The milestones I learned the most from were the ones where I got stuck and had to debug live, with AI helping me read logs and form hypotheses. Those sessions taught me production debugging in a way no tutorial could have.

The real takeaway: AI lets you do more, faster, but you have to stay engaged. The minute you stop reading the diff and just hit accept, you stop learning, and your code starts breaking in ways you can't fix. Treating Claude and Copilot as collaborators I had to manage, not oracles I trusted blindly, is the habit I'm taking forward.