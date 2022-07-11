using System;
using System.Collections.Generic;

namespace CeShop.Domain.Dtos.Responses
{
    public class OrderDetailResponseDto
    {
        public int Id { get; set; }

        public string Account { get; set; }

        public string Code { get; set; }

        public decimal TotalPrice { get; set; }

        public int TotalProduct { get; set; }

        public int Status { get; set; }

        public string OrderStatus { get; set; }

        public DateTime CreateTime { get; set; }

        public List<OrderDetailResponseDtoDetail> Details { get; set; }
    }

    public class OrderDetailResponseDtoDetail
    {
        public int Id { get; set; }
        public int GoodsId { get; set; }
        public int GoodsSkuId { get; set; }
        public string ProductName { get; set; }
        public string SpecsName { get; set; }
        public decimal SellPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public int Quantity { get; set; }
        public string Picture { get; set; }
        public int Status { get; set; }
    }
}