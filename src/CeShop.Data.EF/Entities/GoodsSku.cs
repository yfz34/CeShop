using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 貨品
    /// </summary>
    public class GoodsSku : BaseEntity
    {
        /// <summary>
        /// 商品ID
        /// </summary>
        public int GoodsId { get; set; }

        /// <summary>
        /// 商品名稱
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 貨品代碼
        /// </summary>
        public string SkuCode { get; set; }

        /// <summary>
        /// 貨品排序
        /// </summary>
        public int Sequence { get; set; }

        /// <summary>
        /// 原始價錢
        /// </summary>
        [Column(TypeName = "decimal(9, 2)")]
        public decimal OriginPrice { get; set; }

        /// <summary>
        /// 販賣價錢
        /// </summary>
        [Column(TypeName = "decimal(9, 2)")]
        public decimal SellPrice { get; set; }

        /// <summary>
        /// 狀態
        /// </summary>
        public int Status { get; set; }

        /// <summary>
        /// 存貨
        /// </summary>
        public Inventory Inventory { get; set; }

        public Goods Goods { get; set; }

        public ICollection<GoodsSkuSpecification> GoodsSkuSpecifications { get; set; }
    }
}