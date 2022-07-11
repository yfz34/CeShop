using System.Collections.Generic;
using CeShop.Domain.Dtos.Generics;

namespace CeShop.Domain.Dtos.Responses
{
    public class CategoriesResponseDto
    {
        public int Id { get; set; }
        public int ParentId { get; set; }
        public int Level { get; set; }
        public string Name { get; set; }

        public virtual ICollection<CategoriesResponseDto> Children { get; set; }
    }
}