# osu-buckeye-marketplace
An e-commerce platform design project for Ohio State University focused on user personas, journey mapping, feature development, and user stories.

## 1. Project Description

### Buckeye Marketplace
This project is a simple marketplace app where users can browse products posted by other people, view details on each one and add things to a shopping cart. The frontend is built with React and TypeScript. The backend is a .NET 10 Web API connected to a SQLite database using Entity Framework Core.

Users can filter products by category, click into any product to see the full details and add it to their cart from both the list and detail pages. The cart lets you update quantities, remove items and clear everything out. Cart data saves to the database so it stays there even after refreshing the page.

Milestone 3 was the product catalog. Milestone 4 adds the full shopping cart on top of that, wiring the frontend state all the way through to the database.

---

## 2. How to Run the Project Locally

You need two terminals running at the same time.

### Run the .NET API
```
cd osu-buckeye-marketplace/backend/BuckeyeMarketplace.Api
dotnet run
```
The API starts at something like `https://localhost:5062/api/products`

### Run the React App
```
cd osu-buckeye-marketplace/frontend/buckeye-marketplace-client
npm install
npm run dev
```
Open the browser at the local host it gives you, usually `http://localhost:5173`. The app loads and pulls data from the API automatically.

---

## 3. Screenshots

Product List page and Product Detail page screenshots are in `osu-buckeye-marketplace/Screenshots`

---

## 4. AI Tool Usage

For milestone 3 I was mostly using ChatGPT. By milestone 4 I switched over to Claude and stuck with it for the rest of the project. The difference was pretty noticeable. Claude gave cleaner code, kept things simpler and actually understood what I was trying to build without me having to over-explain everything.

A big part of milestone 4 was using Claude to rework the whole user interface. The original UI from M3 was pretty plain. I gave Claude my existing code and described what I wanted changed and it rewrote the layout, the cart sidebar, the product cards and the category filter buttons in a much cleaner way than what I had before.

### What I asked for help with
1. Setting up the CartController with all five endpoints
2. Switching from in-memory storage to SQLite with EF migrations
3. Setting up React Router so the list and detail pages had real URLs
4. Replacing useState with useReducer for cart state
5. Redesigning the product cards to show all required fields
6. Adding success messages when items get added to the cart
7. Setting up the empty cart state with a button to go back to browsing
8. Writing the .gitignore for both the .NET and React sides of the project
9. Checking my code against the rubric to catch anything missing

### Example prompts I used
1. "Here is my CartController. Clean it up and make sure all five endpoints have the right HTTP status codes."
2. "Switch my project from UseInMemoryDatabase to SQLite with EF Core migrations. Here is my Program.cs and my context file."
3. "Set up React Router in my app with a product list at / and a product detail page at /products/:id. Here are my current files."
4. "My cart is using useState right now. Rewrite it to use useReducer and keep the same functionality."
5. "Here is my ProductCard component. I want it to show all eight required fields from the rubric. Make it clean and simple."
6. "Redesign the cart sidebar and product card layout. Keep it simple but make it look better than what I have."

### What I changed
Claude would sometimes suggest consolidating everything into one big file. I pushed back on that and kept the components in separate files because it made more sense for the project structure. Some styling suggestions did not match what I was going for so I adjusted those. The seed data and image URLs I picked myself.

### Where I used my own judgment
I tested every part of the cart manually to make sure adding, updating and removing items all worked correctly and stayed in sync between the frontend and the database. I also checked that none of the components had hardcoded product data left over from earlier in the project.