using System.ComponentModel.DataAnnotations;

namespace CeShop.Domain.Dtos.Requests
{
    public class CartPutRequestDto
    {
        [Required]
        public int CartDetailId { get; set; }
        [Required]
        public int Quantity { get; set; }
    }
}