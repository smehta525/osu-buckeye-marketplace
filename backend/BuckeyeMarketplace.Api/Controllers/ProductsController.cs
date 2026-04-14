using BuckeyeMarketplace.Api.Data;
using BuckeyeMarketplace.Api.Dtos;
using BuckeyeMarketplace.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuckeyeMarketplace.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly BuckeyeMarketplaceContext _context;

    public ProductsController(BuckeyeMarketplaceContext context)
    {
        _context = context;
    }

    // GET /api/products — public
    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetProducts()
    {
        return Ok(await _context.Products.ToListAsync());
    }

    // GET /api/products/{id} — public
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();
        return Ok(product);
    }

    // POST /api/products — admin only
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Product>> CreateProduct([FromBody] CreateProductRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var product = new Product
        {
            Title = request.Title,
            Description = request.Description,
            Price = request.Price,
            Category = request.Category,
            SellerName = request.SellerName,
            PostedDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            ImageUrl = request.ImageUrl
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    // PUT /api/products/{id} — admin only
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, [FromBody] UpdateProductRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();

        product.Title = request.Title;
        product.Description = request.Description;
        product.Price = request.Price;
        product.Category = request.Category;
        product.SellerName = request.SellerName;
        product.ImageUrl = request.ImageUrl;

        await _context.SaveChangesAsync();
        return Ok(product);
    }

    // DELETE /api/products/{id} — admin only
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}