using System.Collections.Generic;

namespace CeShop.Domain.Dtos.Responses
{
    public class UserMiniCartReponseDto
    {
        public int TotalCount { get; set; }
        public List<UserMiniCart> Carts { get; set; }
    }

    public class UserMiniCart
    {
        public int GoodsId { get; set; }
        public int GoodsSkuId { get; set; }
        public string Name { get; set; }
        public string Picture { get; set; }
        public decimal Price { get; set; }
    }
}