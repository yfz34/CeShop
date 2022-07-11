using System.ComponentModel.DataAnnotations.Schema;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 貨品庫存
    /// </summary>
    public class Inventory : BaseEntity
    {
        /// <summary>
        /// 貨品ID
        /// </summary>
        /// <value></value>
        public int GoodsSkuId { get; set; }

        /// <summary>
        /// 存貨量
        /// </summary>
        /// <value></value>
        public int Quantity { get; set; }
    }
}