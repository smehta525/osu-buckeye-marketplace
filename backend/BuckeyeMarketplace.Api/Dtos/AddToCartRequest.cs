using System.ComponentModel.DataAnnotations;

namespace BuckeyeMarketplace.Api.Dtos;

public class AddToCartRequest
{
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Range(1, 99)]
    public int Quantity { get; set; } = 1;
}