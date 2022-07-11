using System.ComponentModel.DataAnnotations;

namespace CeShop.Domain.Dtos.Requests
{
    public class CartPostRequestDto
    {
        [Required]
        public int GoodsId { get; set; }
        [Required]
        public int SkuId { get; set; }
        [Required]
        public int Quantity { get; set; }
    }
}