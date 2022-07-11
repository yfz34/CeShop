using System.Collections.Generic;
using CeShop.Domain.Dtos.Generics;

namespace CeShop.Domain.Dtos.Responses
{
    public class GoodsDetailResponseDto
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Unit { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string MainImage { get; set; }
        public int Status { get; set; }

        public List<CategoryDto> Categories { get; set; }
        public List<string> Images { get; set; }
        public List<AttributeDto> Attributes { get; set; }
        public List<SpecificationDto> Specifications { get; set; }
        public List<GoodsSkuDto> GoodsSkus { get; set; }
    }
}