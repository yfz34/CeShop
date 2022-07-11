using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CeShop.Domain.Dtos.Requests
{
    public class GoodsTypePostRequestDto
    {
        [Required]
        public string Name { get; set; }
        public List<TypeAttributeDto> TypeAttributes { get; set; }
        public List<TypeSpecificationDto> TypeSpecifications { get; set; }
    }

    public class TypeAttributeDto
    {
        public string Name { get; set; }
        public List<TypeAttributeOptionDto> TypeAttributeOptions { get; set; }
    }

    public class TypeAttributeOptionDto
    {
        public string Value { get; set; }
    }

    public class TypeSpecificationDto
    {
        public string Name { get; set; }
        public List<TypeSpecificationOptionDto> TypeSpecificationOptions { get; set; }
    }

    public class TypeSpecificationOptionDto
    {
        public string Value { get; set; }
    }
}