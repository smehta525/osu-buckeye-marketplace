namespace BuckeyeMarketplace.Api.Models;

public class Product
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public decimal Price { get; set; }
    public string Category { get; set; } = "";
    public string SellerName { get; set; } = "";
    public string PostedDate { get; set; } = "";
    public string ImageUrl { get; set; } = "";
}