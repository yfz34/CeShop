namespace CeShop.Domain.Dtos.Requests
{
    public class CategoryPostRequestDto
    {
        public int ParentId { get; set; }
        public int Level { get; set; }
        public string Name { get; set; }
    }
}