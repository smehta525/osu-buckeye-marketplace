using BuckeyeMarketplace.Api.Data;
using BuckeyeMarketplace.Api.Dtos;
using BuckeyeMarketplace.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuckeyeMarketplace.Api.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private readonly BuckeyeMarketplaceContext _context;
    private const string CurrentUserId = "default-user";

    public CartController(BuckeyeMarketplaceContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<CartResponseDto>> GetCart()
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart == null)
        {
            return NotFound(new { message = "Cart not found." });
        }

        return Ok(MapCart(cart));
    }

    [HttpPost]
    public async Task<ActionResult<CartResponseDto>> AddToCart([FromBody] AddToCartRequest request)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId);

        if (product == null)
        {
            return NotFound(new { message = "Product not found." });
        }

        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart == null)
        {
            cart = new Cart { UserId = CurrentUserId };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        var existingItem = await _context.CartItems
            .Include(i => i.Product)
            .FirstOrDefaultAsync(i => i.CartId == cart.Id && i.ProductId == request.ProductId);

        if (existingItem != null)
        {
            existingItem.Quantity += request.Quantity;
        }
        else
        {
            _context.CartItems.Add(new CartItem
            {
                CartId = cart.Id,
                ProductId = request.ProductId,
                Quantity = request.Quantity
            });
        }

        await _context.SaveChangesAsync();

        var updatedCart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstAsync(c => c.UserId == CurrentUserId);

        return CreatedAtAction(nameof(GetCart), MapCart(updatedCart));
    }

    [HttpPut("{cartItemId:int}")]
    public async Task<ActionResult<CartResponseDto>> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemRequest request)
    {
        var cartItem = await _context.CartItems
            .Include(i => i.Cart)
            .Include(i => i.Product)
            .FirstOrDefaultAsync(i => i.Id == cartItemId && i.Cart.UserId == CurrentUserId);

        if (cartItem == null)
        {
            return NotFound(new { message = "Cart item not found." });
        }

        cartItem.Quantity = request.Quantity;
        await _context.SaveChangesAsync();

        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstAsync(c => c.UserId == CurrentUserId);

        return Ok(MapCart(cart));
    }

    [HttpDelete("{cartItemId:int}")]
    public async Task<IActionResult> RemoveCartItem(int cartItemId)
    {
        var cartItem = await _context.CartItems
            .Include(i => i.Cart)
            .FirstOrDefaultAsync(i => i.Id == cartItemId && i.Cart.UserId == CurrentUserId);

        if (cartItem == null)
        {
            return NotFound(new { message = "Cart item not found." });
        }

        _context.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart == null)
        {
            return NotFound(new { message = "Cart not found." });
        }

        _context.CartItems.RemoveRange(cart.Items);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static CartResponseDto MapCart(Cart cart)
    {
        var items = cart.Items.Select(i => new CartItemDto
        {
            Id = i.Id,
            ProductId = i.ProductId,
            ProductName = i.Product.Title,
            UnitPrice = i.Product.Price,
            Quantity = i.Quantity,
            Subtotal = i.Product.Price * i.Quantity
        }).ToList();

        return new CartResponseDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            ItemCount = items.Sum(i => i.Quantity),
            CartTotal = items.Sum(i => i.Subtotal),
            Items = items
        };
    }
}