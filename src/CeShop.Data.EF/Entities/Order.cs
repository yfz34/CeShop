using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 使用者訂單
    /// </summary>
    public class Order : BaseEntity
    {
        /// <summary>
        /// 使用者ID
        /// </summary>
        /// <value></value>
        public int UserId { get; set; }

        /// <summary>
        /// 訂單編號
        /// </summary>
        /// <value></value>
        public string Code { get; set; }

        /// <summary>
        /// 總價錢
        /// </summary>
        /// <value></value>
        [Column(TypeName = "decimal(9, 2)")]
        public decimal TotalPrice { get; set; }

        /// <summary>
        /// 商品數量
        /// </summary>
        /// <value></value>
        public int TotalProduct { get; set; }

        /// <summary>
        /// 狀態 1: 存在, 0: 刪除
        /// </summary>
        /// <value></value>
        public int Status { get; set; }

        /// <summary>
        /// 訂單狀態
        /// </summary>
        /// <value></value>
        public string OrderStatus { get; set; }

        public ICollection<OrderDetail> OrderDetails { get; set; }

        [ForeignKey(nameof(UserId))]
        public AppUser User { get; set; }
    }
}