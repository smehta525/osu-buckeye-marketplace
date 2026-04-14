using BuckeyeMarketplace.Api.Data;
using BuckeyeMarketplace.Api.Dtos;
using BuckeyeMarketplace.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BuckeyeMarketplace.Api.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly BuckeyeMarketplaceContext _context;

    public OrdersController(BuckeyeMarketplaceContext context)
    {
        _context = context;
    }

    private string CurrentUserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    // POST /api/orders — create order from cart
    [HttpPost]
    public async Task<ActionResult<OrderResponseDto>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart == null || !cart.Items.Any())
            return BadRequest(new { message = "Cart is empty." });

        var order = new Order
        {
            UserId = CurrentUserId,
            ShippingAddress = request.ShippingAddress,
            ConfirmationNumber = "BM-" + Guid.NewGuid().ToString("N")[..8].ToUpper(),
            Total = cart.Items.Sum(i => i.Product.Price * i.Quantity),
            Items = cart.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                ProductTitle = i.Product.Title,
                UnitPrice = i.Product.Price,
                Quantity = i.Quantity
            }).ToList()
        };

        _context.Orders.Add(order);

        // Clear cart after order
        _context.CartItems.RemoveRange(cart.Items);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMyOrders), MapOrder(order));
    }

    // GET /api/orders/mine — current user's orders
    [HttpGet("mine")]
    public async Task<ActionResult<List<OrderResponseDto>>> GetMyOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .Where(o => o.UserId == CurrentUserId)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        return Ok(orders.Select(MapOrder).ToList());
    }

    // GET /api/orders — admin: all orders
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<OrderResponseDto>>> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        return Ok(orders.Select(MapOrder).ToList());
    }

    // PUT /api/orders/{orderId}/status — admin: update order status
    [HttpPut("{orderId}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<OrderResponseDto>> UpdateOrderStatus(int orderId, [FromBody] UpdateOrderStatusRequest request)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
            return NotFound(new { message = "Order not found." });

        order.Status = request.Status;
        await _context.SaveChangesAsync();

        return Ok(MapOrder(order));
    }

    private static OrderResponseDto MapOrder(Order order)
    {
        return new OrderResponseDto
        {
            Id = order.Id,
            OrderDate = order.OrderDate,
            Status = order.Status,
            Total = order.Total,
            ShippingAddress = order.ShippingAddress,
            ConfirmationNumber = order.ConfirmationNumber,
            Items = order.Items.Select(i => new Dtos.OrderItemDto
            {
                ProductId = i.ProductId,
                ProductTitle = i.ProductTitle,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity
            }).ToList()
        };
    }
}