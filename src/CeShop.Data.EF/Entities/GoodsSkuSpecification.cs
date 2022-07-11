using System.ComponentModel.DataAnnotations.Schema;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 貨品與規格關聯表
    /// </summary>
    public class GoodsSkuSpecification : BaseEntity
    {
        /// <summary>
        /// 貨品ID
        /// </summary>
        /// <value></value>
        public int GoodsSkuId { get; set; }

        public GoodsSku GoodsSku { get; set; }

        public GoodsSpecification GoodsSpecification { get; set; }

        public GoodsSpecificationOption GoodsSpecificationOption { get; set; }
    }
}