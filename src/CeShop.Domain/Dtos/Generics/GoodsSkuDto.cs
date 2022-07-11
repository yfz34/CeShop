using System.Collections.Generic;

namespace CeShop.Domain.Dtos.Generics
{
    public class GoodsSkuDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string SkuCode { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public int Status { get; set; }

        public List<SkuSpecificationDto> SkuSpecifications { get; set; }
    }

    public class SkuSpecificationDto
    {
        public int SpecId { get; set; }
        public string SpecName { get; set; }
        public int SpecOptionId { get; set; }
        public string SpecOptionName { get; set; }
    }
}