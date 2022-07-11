using System.ComponentModel.DataAnnotations.Schema;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 使用者訂單明細
    /// </summary>
    public class OrderDetail : BaseEntity
    {
        /// <summary>
        /// 訂單ID
        /// </summary>
        /// <value></value>
        public int OrderId { get; set; }

        /// <summary>
        /// 商品ID
        /// </summary>
        /// <value></value>
        public int GoodsId { get; set; }

        /// <summary>
        /// 貨品ID
        /// </summary>
        /// <value></value>
        public int GoodsSkuId { get; set; }

        /// <summary>
        /// 商品名稱
        /// </summary>
        /// <value></value>
        public string ProductName { get; set; }

        /// <summary>
        /// 合併規格名稱
        /// </summary>
        /// <value></value>
        public string SpecsName { get; set; }
        [Column(TypeName = "decimal(9, 2)")]

        /// <summary>
        /// 單品價格
        /// </summary>
        /// <value></value>
        public decimal SellPrice { get; set; }

        /// <summary>
        /// 該商品合計
        /// </summary>
        /// <value></value>
        [Column(TypeName = "decimal(9, 2)")]
        public decimal TotalPrice { get; set; }

        /// <summary>
        /// 購買數量
        /// </summary>
        /// <value></value>
        public int Quantity { get; set; }

        /// <summary>
        /// 商品照片名稱
        /// </summary>
        /// <value></value>
        public string Picture { get; set; }

        /// <summary>
        /// 狀態
        /// </summary>
        /// <value></value>
        public int Status { get; set; }

        public Goods Goods { get; set; }
        public GoodsSku GoodsSku { get; set; }
    }
}