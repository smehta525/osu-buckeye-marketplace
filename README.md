# osu-buckeye-marketplace
An e-commerce platform design project for Ohio State University focused on user personas, journey mapping, feature development, and user stories.


Buckeye Marketplace
This project is a simple marketplace app where users can view products posted by other people. The app shows a list of products and lets the user click on a product to see more details. The frontend is built with React and the backend is a .NET Web API that returns product data.
The API stores products in memory and sends them to the React frontend. The React app fetches the data and displays it in product cards.
How to Run the Project Locally
You need to run the .NET API and the React frontend.
1. Run the .NET API
Open the API project in Visual Studio
Run the project
The API should start on something like:
https://localhost:5001/api/products
You can test the endpoint in the browser to see the JSON product list.
2. Run the React App
Open the React project folder in the terminal
Install dependencies
npm install
Start the development server
npm run dev
Open the browser at
http://localhost:5173
The React app should load and fetch product data from the API.
Product List Page
This page shows all products in a grid layout. Each product card shows the product image title price category and seller name. The data is fetched from the API endpoint /api/products.
Add your screenshot here.
/screenshots/product-list.png
Product Detail Page
When a user clicks on a product they are taken to the product detail page. This page shows the full product information including description price category seller name posted date and image.
The page gets its data from the API endpoint /api/products/{id}.
Add your screenshot here.
/screenshots/product-detail.png
AI Tool Usage
I used AI tools like ChatGPT and GitHub Copilot to help while working on the project. I mostly used them to understand concepts and help debug issues.
What AI helped with
Helping create the ProductsController in the API
Generating example product data
Fixing image size issues
Checking if the API endpoints matched the assignment requirements
Example prompts
Some examples of prompts I used:
"How do I create a .NET API endpoint that returns a list of products"
"Generate example product data with id title description price category seller name posted date and image url"
"How do I make images the same size in React cards"
What I changed
I modified the generated product data and added more products so there were at least 8 products across multiple categories. I also changed some image URLs and adjusted the layout so the product cards were consistent.