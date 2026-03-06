using Microsoft.AspNetCore.Mvc;
using BuckeyeMarketplace.Api.Models;

namespace BuckeyeMarketplace.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    // In-memory "database" for Milestone 3
    private static readonly List<Product> Products =
    [
        new Product
        {
            Id = 1,
            Title = "Heels",
            Description = "Good condition. Barely used. Size 7.",
            Price = 15.00m,
            Category = "Clothing",
            SellerName = "Rakhi M.",
            PostedDate = "2026-03-01",
            ImageUrl = "https://picsum.photos/id/21/600/400"
        },

        new Product
        {
            Id = 2,
            Title = "Calculator",
            Description = "Perfect condition. Good for simple math.",
            Price = 25.99m,
            Category = "Electronics",
            SellerName = "Ava P.",
            PostedDate = "2026-03-01",
            ImageUrl = "https://images.unsplash.com/photo-1711344397160-b23d5deaa012?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800"
        },
        new Product
        {
            Id = 3,
            Title = "MacBook Air",
            Description = "Runs great, battery health ~90%. Includes charger.",
            Price = 479.99m,
            Category = "Electronics",
            SellerName = "Jordan S.",
            PostedDate = "2026-02-27",
            ImageUrl = "https://picsum.photos/id/1/600/400"

        },
        new Product
        {
            Id = 4,
            Title = "Dorm Mini Fridge",
            Description = "Clean, works perfectly. Pickup near campus.",
            Price = 60.99m,
            Category = "Appliances",
            SellerName = "Mia R.",
            PostedDate = "2026-02-28",
            ImageUrl = "https://images.unsplash.com/photo-1759772238095-d1ed3f036ad5?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=600"
        },
        new Product
        {
            Id = 5,
            Title = "Graphic Hoodie",
            Description = "Nice design. Worn a few times. Size M.",
            Price = 22.99m,
            Category = "Clothing",
            SellerName = "Sam K.",
            PostedDate = "2026-03-02",
            ImageUrl = "https://images.unsplash.com/photo-1680292783974-a9a336c10366?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=600"
        },
        new Product
        {
            Id = 6,
            Title = "Desk Lamp",
            Description = "LED lamp, adjustable brightness. USB powered.",
            Price = 35.00m,
            Category = "Furniture",
            SellerName = "Lena T.",
            PostedDate = "2026-03-03",
            ImageUrl = "https://images.unsplash.com/photo-1621447980929-6638614633c8?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=600"
        },
        new Product
        {
            Id = 7,
            Title = "Shelf",
            Description = "Standalone shelf, good for books or decor. Some scratches.",
            Price = 25.0m,
            Category = "Furniture",
            SellerName = "Noah B.",
            PostedDate = "2026-02-25",
            ImageUrl = "https://plus.unsplash.com/premium_photo-1768597134173-228f8dc20392?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500"
        },
        new Product
        {
            Id = 8,
            Title = "iPad",
            Description = "Great for notes. Includes case, no scratches.",
            Price = 210.00m,
            Category = "Electronics",
            SellerName = "Priya D.",
            PostedDate = "2026-03-01",
            ImageUrl = "https://images.unsplash.com/photo-1661340272675-f6829791246e?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=600"
        },
        new Product
        {
            Id = 9,
            Title = "Coffee Table",
            Description = "Solid wood. Some minor wear but sturdy.",
            Price = 40.99m,
            Category = "Furniture",
            SellerName = "Chris W.",
            PostedDate = "2026-02-26",
            ImageUrl = "https://images.unsplash.com/photo-1738682767952-f85017e1a682?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=600"
        }
    ];

    // GET /api/products
    [HttpGet]
    public ActionResult<IEnumerable<Product>> GetAll()
    {
        return Ok(Products);
    }

    // GET /api/products/{id}
    [HttpGet("{id:int}")]
    public ActionResult<Product> GetById(int id)
    {
        var product = Products.FirstOrDefault(p => p.Id == id);
        if (product is null)
            return NotFound(new { message = $"ERROR 404: Product with id {id} not found." });

        return Ok(product);
    }
}