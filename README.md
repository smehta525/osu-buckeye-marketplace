# osu-buckeye-marketplace
An e-commerce platform design project for Ohio State University focused on user personas, journey mapping, feature development, and user stories.

1. Project Description
    Buckeye Marketplace
        This project is a simple marketplace app where users can view products posted by other people. The app shows a list of products and lets the user click on a product to see more details. The frontend is built with React and the backend is a .NET Web API that returns product data.

        The API stores products in memory and sends them to the React frontend. The React app fetches the data and displays it in product cards.

        This milestone focuses on building a vertical slice, so the frontend and backend work together so users can view products and see their details.

2. How to Run the Project Locally:
    You need to run the .NET API and the React frontend.

    1. Run the .NET API
        cd into osu-buckeye-marketplace/backend/BuckeyeMarketplace.Api
        run the project by typing in terminal: dotnet run
        the API should start on something like: https://localhost:5001/api/products

    2. Run the React App
        create new terminal
        cd into osu-buckeye-marketplace/frontend/buckeye-marketplace-client
        install dependencies if needed: npm install
        run the dev server by typing in terminal: npm run dev
        Open the browser at the local host it provides
        the host should start on something like: http://localhost:5173
        The React app should load and fetch product data from the API.

3. Product List page and Product Detail page screenshots found in osu-buckeye-marketplace/Screenshots

4. AI Tool Usage
    I used AI tools like ChatGPT and GitHub Copilot while working on this milestone. I used them to help with coding problems, debugging,  checking if my project met the assignment requirements, and this README file.
    
    What I asked AI to help with
        1. Set up the ProductsController for the .NET API
        2. Sample product data for the project
        3. Fix issues connecting the React frontend to the API
        4. Figure out how to make all the product images the same size in stylesheets
        5. Check if my project was meeting the assignment rubric requirements fully
        6. Troubleshoot some image size and layout problems
        7. Helped me check that the API endpoints matched what the assignment asked for

    Example prompts
        1. Help me create a ProductsController in a .NET Web API that includes GET /api/products and GET /api/products/{id} and returns 404 if the product is not found.
        2. Generate sample marketplace product data with fields id title description price category sellerName postedDate and imageUrl for testing an in memory API.
        3. How do I fetch data from a .NET API in a React component using useEffect and fetch?
        4. How can I make product images the same size in a React card layout without stretching them?
    
    What I changed
        I used some of the structure AI suggested for the API controller and the sample product data. I changed the product data so there were at least 8 products and multiple categories. I also updated some image URLs and fixed parts of the code so it worked correctly with my project.
        Some suggestions did not match my layout so I did not use them.

    Where I used my own judgment
        I checked that the API endpoints worked correctly and returned the right data. I also made sure the React app was fetching data from the API and not using hardcoded products. I tested the list page and detail page to make sure navigation worked.
