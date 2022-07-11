namespace CeShop.Domain.Dtos.Generics
{
    public class ItemDto
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Sequence { get; set; }
        public int Status { get; set; }
        public decimal Weight { get; set; }
        public string Unit { get; set; }
        public decimal OriginPrice { get; set; }
        public decimal SellPrice { get; set; }
        public int Stock { get; set; }
        public string MainImage { get; set; }
    }
}