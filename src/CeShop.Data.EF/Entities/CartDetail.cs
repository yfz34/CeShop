using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 購物車明細
    /// </summary>
    public class CartDetail : BaseEntity
    {
        /// <summary>
        /// 購物車ID
        /// </summary>
        /// <value></value>
        public int CartId { get; set; }

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
        /// 選擇商品數量
        /// </summary>
        /// <value></value>
        public int Quantity { get; set; }

        /// <summary>
        /// 狀態
        /// </summary>
        /// <value></value>
        public int Status { get; set; }

        public Goods Goods { get; set; }
        public GoodsSku GoodsSku { get; set; }
    }
}