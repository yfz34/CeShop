using System.Collections.Generic;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 商品屬性
    /// </summary>
    public class GoodsAttribute : BaseEntity
    {
        /// <summary>
        /// 商品ID
        /// </summary>
        /// <value></value>
        public int GoodsId { get; set; }

        /// <summary>
        /// 屬性名稱
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// 屬性值
        /// </summary>
        /// <value></value>
        public string Value { get; set; }

        /// <summary>
        /// 順序
        /// </summary>
        /// <value></value>
        public int Sequence { get; set; }
    }
}