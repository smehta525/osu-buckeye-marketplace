using System.Net.Http.Headers;
using System.Security.Claims;
using BuckeyeMarketplace.Api.Data;
using BuckeyeMarketplace.Api.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Data.Sqlite;
using System.Text.Encodings.Web;

namespace BuckeyeMarketplace.Api.Tests.IntegrationTests;

public class CartOwnershipIntegrationTests : IClassFixture<CartOwnershipWebApplicationFactory>
{
    private readonly CartOwnershipWebApplicationFactory _factory;

    public CartOwnershipIntegrationTests(CartOwnershipWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetCart_ReturnsOnlyAuthenticatedUsersCart()
    {
        await using var context = _factory.Services.CreateScope().ServiceProvider.GetRequiredService<BuckeyeMarketplaceContext>();
        context.Carts.RemoveRange(context.Carts);
        context.CartItems.RemoveRange(context.CartItems);
        context.Products.RemoveRange(context.Products);
        await context.SaveChangesAsync();

        var product = new Product
        {
            Id = 101,
            Title = "Desk Lamp",
            Description = "LED lamp",
            Price = 35m,
            Category = "Furniture",
            SellerName = "Lena T.",
            PostedDate = "2026-03-03",
            ImageUrl = "https://example.com/lamp.png"
        };

        var ownedCart = new Cart { Id = 201, UserId = "user-1" };
        var otherCart = new Cart { Id = 202, UserId = "user-2" };

        context.Products.Add(product);
        context.Carts.AddRange(ownedCart, otherCart);
        context.CartItems.AddRange(
            new CartItem { Id = 301, CartId = ownedCart.Id, ProductId = product.Id, Quantity = 2 },
            new CartItem { Id = 302, CartId = otherCart.Id, ProductId = product.Id, Quantity = 4 }
        );
        await context.SaveChangesAsync();

        using var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Test");

        var response = await client.GetAsync("/api/cart");

        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadAsStringAsync();

        Assert.Contains("\"userId\":\"user-1\"", body);
        Assert.Contains("\"itemCount\":2", body);
        Assert.Contains("\"cartTotal\":70", body);
        Assert.DoesNotContain("\"userId\":\"user-2\"", body);
    }
}

public class CartOwnershipWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly SqliteConnection _connection = new("Data Source=:memory:");

    public CartOwnershipWebApplicationFactory()
    {
        _connection.Open();
    }

    protected override void ConfigureWebHost(Microsoft.AspNetCore.Hosting.IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            services.RemoveAll(typeof(DbContextOptions<BuckeyeMarketplaceContext>));
            services.AddDbContext<BuckeyeMarketplaceContext>(options => options.UseSqlite(_connection));

            services.AddAuthentication("Test")
                .AddScheme<AuthenticationSchemeOptions, TestAuthenticationHandler>("Test", _ => { });
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (disposing)
        {
            _connection.Dispose();
        }
    }
}

public class TestAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public TestAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "user-1"),
            new Claim(ClaimTypes.Name, "Test User")
        };

        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
