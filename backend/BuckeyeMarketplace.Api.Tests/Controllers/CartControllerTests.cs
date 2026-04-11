using BuckeyeMarketplace.Api.Controllers;
using BuckeyeMarketplace.Api.Data;
using BuckeyeMarketplace.Api.Dtos;
using BuckeyeMarketplace.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BuckeyeMarketplace.Api.Tests.Controllers;

public class CartControllerTests
{
    [Fact]
    public async Task GetCart_ReturnsNotFound_WhenCartDoesNotExist()
    {
        await using var context = BuildContext();
        var controller = CreateController(context);

        var result = await controller.GetCart();

        var notFound = Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.Equal(404, notFound.StatusCode);
    }

    [Fact]
    public async Task AddToCart_CreatesCartAndReturnsCreatedResult()
    {
        await using var context = BuildContext();
        context.Products.Add(new Product { Id = 3, Title = "MacBook Air", Price = 479.99m });
        await context.SaveChangesAsync();

        var controller = CreateController(context);

        var result = await controller.AddToCart(new AddToCartRequest { ProductId = 3, Quantity = 2 });

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var dto = Assert.IsType<CartResponseDto>(created.Value);
        Assert.Equal("GetCart", created.ActionName);
        Assert.Equal(2, dto.ItemCount);
        Assert.Equal(959.98m, dto.CartTotal);
        Assert.Single(dto.Items);
        Assert.Equal("MacBook Air", dto.Items[0].ProductName);
        Assert.Equal(2, dto.Items[0].Quantity);
        Assert.Equal(959.98m, dto.Items[0].Subtotal);
    }

    [Fact]
    public async Task AddToCart_ReturnsNotFound_WhenProductDoesNotExist()
    {
        await using var context = BuildContext();
        var controller = CreateController(context);

        var result = await controller.AddToCart(new AddToCartRequest { ProductId = 404, Quantity = 1 });

        var notFound = Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.Equal(404, notFound.StatusCode);
    }

    [Fact]
    public async Task UpdateCartItem_ReturnsNotFound_WhenItemDoesNotExist()
    {
        await using var context = BuildContext();
        var controller = CreateController(context);

        var result = await controller.UpdateCartItem(55, new UpdateCartItemRequest { Quantity = 3 });

        var notFound = Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.Equal(404, notFound.StatusCode);
    }

    [Fact]
    public async Task RemoveCartItem_RemovesItemAndReturnsNoContent()
    {
        await using var context = BuildContext();

        var product = new Product { Id = 9, Title = "Coffee Table", Price = 40.99m };
        var cart = new Cart { Id = 1, UserId = "default-user" };
        var item = new CartItem { Id = 15, CartId = cart.Id, ProductId = product.Id, Quantity = 1 };

        context.Products.Add(product);
        context.Carts.Add(cart);
        context.CartItems.Add(item);
        await context.SaveChangesAsync();

        var controller = CreateController(context);

        var result = await controller.RemoveCartItem(15);

        Assert.IsType<NoContentResult>(result);
        Assert.False(await context.CartItems.AnyAsync(ci => ci.Id == 15));
    }

    private static BuckeyeMarketplaceContext BuildContext()
    {
        var options = new DbContextOptionsBuilder<BuckeyeMarketplaceContext>()
            .UseInMemoryDatabase(databaseName: $"cart-tests-{Guid.NewGuid()}")
            .Options;

        return new BuckeyeMarketplaceContext(options);
    }

    private static CartController CreateController(BuckeyeMarketplaceContext context)
    {
        var controller = new CartController(context);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(
                    [new Claim(ClaimTypes.NameIdentifier, "default-user")],
                    "TestAuth"))
            }
        };

        return controller;
    }
}
