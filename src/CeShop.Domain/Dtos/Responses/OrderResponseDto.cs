using System;

namespace CeShop.Domain.Dtos.Responses
{
    public class OrderResponseDto
    {
        public int Id { get; set; }

        public string Account { get; set; }

        public string Code { get; set; }

        public decimal TotalPrice { get; set; }

        public int TotalProduct { get; set; }

        public int Status { get; set; }

        public string OrderStatus { get; set; }

        public DateTime CreateTime { get; set; }
    }
}