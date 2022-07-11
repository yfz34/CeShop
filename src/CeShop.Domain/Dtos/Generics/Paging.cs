using System.Collections.Generic;

namespace CeShop.Domain.Dtos.Generics
{
    public class Paging<T>
    {
        public int Page { get; set; }
        public int Size { get; set; }
        public ICollection<T> Results { get; set; }
        public int TotalCount { get; set; }
    }
}