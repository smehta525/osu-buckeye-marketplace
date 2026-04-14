using System.ComponentModel.DataAnnotations;

namespace BuckeyeMarketplace.Api.Dtos;

public class CreateOrderRequest
{
    [Required]
    public string ShippingAddress { get; set; } = string.Empty;
}

public class UpdateOrderStatusRequest
{
    [Required]
    public string Status { get; set; } = string.Empty;
}

public class OrderResponseDto
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public string ShippingAddress { get; set; } = string.Empty;
    public string ConfirmationNumber { get; set; } = string.Empty;
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public int ProductId { get; set; }
    public string ProductTitle { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal => UnitPrice * Quantity;
}