using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CeShop.Domain.Dtos.Requests
{
    public class GoodsPostRequestDto
    {
        [Required]
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Status { get; set; }
        public string Unit { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int? CategoryLevel1Id { get; set; }
        public int? CategoryLevel2Id { get; set; }
        public int? CategoryLevel3Id { get; set; }
        public int? GoodsTypeId { get; set; }
        public string MainPicture { get; set; }

        // 規格
        public List<GoodsSpecificationDto> GoodsSpecifications { get; set; }

        // 屬性
        public List<GoodsAttributeDto> GoodsAttributes { get; set; }

        // 照片
        public List<string> Pictures { get; set; }

        // sku
        public List<GoodsSkuRequestDto> GoodsSkus { get; set; }
    }

    public class GoodsAttributeDto
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }

    public class GoodsSpecificationDto
    {
        public string Name { get; set; }

        public List<GoodsSpecificationOptionDto> GoodsSpecificationOptions { get; set; }
    }

    public class GoodsSpecificationOptionDto
    {
        public string Name { get; set; }
        public string PictureName { get; set; }
    }

    public class GoodsSkuRequestDto
    {
        public string Code { get; set; }
        public decimal Price { get; set; }
        public int Status { get; set; }
        public int Quantity { get; set; }

        public ICollection<GoodsSkuSpecificationDto> GoodsSkuSpecifications { get; set; }
    }

    public class GoodsSkuSpecificationDto
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }
}