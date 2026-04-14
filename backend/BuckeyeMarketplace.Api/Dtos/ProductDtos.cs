using System.ComponentModel.DataAnnotations;

namespace BuckeyeMarketplace.Api.Dtos;

public class CreateProductRequest
{
    [Required] public string Title { get; set; } = string.Empty;
    [Required] public string Description { get; set; } = string.Empty;
    [Range(0.01, 99999)] public decimal Price { get; set; }
    [Required] public string Category { get; set; } = string.Empty;
    [Required] public string SellerName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
}

public class UpdateProductRequest
{
    [Required] public string Title { get; set; } = string.Empty;
    [Required] public string Description { get; set; } = string.Empty;
    [Range(0.01, 99999)] public decimal Price { get; set; }
    [Required] public string Category { get; set; } = string.Empty;
    [Required] public string SellerName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
}