namespace CeShop.Domain.Dtos.Responses
{
    public class UserCartReponseDto
    {
        public int CartDetailId { get; set; }
        public int GoodsId { get; set; }
        public int GoodsSkuId { get; set; }
        public string Name { get; set; }
        public int SkuQuantity { get; set; }
        public string SkuSpecs { get; set; }
        public string Picture { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public int GoodsStatus { get; set; }
    }
}