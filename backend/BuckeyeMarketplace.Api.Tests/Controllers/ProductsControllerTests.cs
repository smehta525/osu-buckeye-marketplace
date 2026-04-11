using BuckeyeMarketplace.Api.Controllers;
using BuckeyeMarketplace.Api.Data;
using BuckeyeMarketplace.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuckeyeMarketplace.Api.Tests.Controllers;

public class ProductsControllerTests
{
    [Fact]
    public async Task GetAll_ReturnsAllProducts()
    {
        await using var context = BuildContext();
        context.Products.AddRange(
            new Product { Id = 1, Title = "Heels", Price = 15m },
            new Product { Id = 2, Title = "Calculator", Price = 25.99m }
        );
        await context.SaveChangesAsync();

        var controller = new ProductsController(context);

        var result = await controller.GetAll();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var products = Assert.IsAssignableFrom<IEnumerable<Product>>(ok.Value);
        Assert.Equal(2, products.Count());
        Assert.Contains(products, p => p.Title == "Heels");
        Assert.Contains(products, p => p.Title == "Calculator");
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenProductDoesNotExist()
    {
        await using var context = BuildContext();
        var controller = new ProductsController(context);

        var result = await controller.GetById(999);

        var notFound = Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.Equal(404, notFound.StatusCode);
    }

    [Fact]
    public async Task GetById_ReturnsProduct_WhenProductExists()
    {
        await using var context = BuildContext();
        context.Products.Add(new Product { Id = 4, Title = "Desk Lamp", Price = 35m });
        await context.SaveChangesAsync();

        var controller = new ProductsController(context);

        var result = await controller.GetById(4);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var product = Assert.IsType<Product>(ok.Value);
        Assert.Equal(4, product.Id);
        Assert.Equal("Desk Lamp", product.Title);
    }

    private static BuckeyeMarketplaceContext BuildContext()
    {
        var options = new DbContextOptionsBuilder<BuckeyeMarketplaceContext>()
            .UseInMemoryDatabase(databaseName: $"products-tests-{Guid.NewGuid()}")
            .Options;

        return new BuckeyeMarketplaceContext(options);
    }
}
