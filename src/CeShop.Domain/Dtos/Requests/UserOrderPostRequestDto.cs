using System.Collections.Generic;

namespace CeShop.Domain.Dtos.Requests
{
    public class UserOrderPostRequestDto
    {
        public int TotalPrice { get; set; }
        public List<int> CartDetailIds { get; set; }
    }
}