using System.ComponentModel.DataAnnotations;

namespace BuckeyeMarketplace.Api.Dtos;

public class UpdateCartItemRequest
{
    [Range(1, 99)]
    public int Quantity { get; set; }
}