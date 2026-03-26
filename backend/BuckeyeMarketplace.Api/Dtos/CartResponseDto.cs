namespace BuckeyeMarketplace.Api.Dtos;

public class CartResponseDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int ItemCount { get; set; }
    public decimal CartTotal { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
}

public class CartItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal { get; set; }
}