using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 商品與分類關聯表
    /// </summary>
    public class CategoryGoods : BaseEntity
    {
        /// <summary>
        /// 分類ID
        /// </summary>
        /// <value></value>
        public int CategoryId { get; set; }

        /// <summary>
        /// 商品ID
        /// </summary>
        /// <value></value>
        public int GoodsId { get; set; }

        public Category Category { get; set; }
        public Goods Goods { get; set; }
    }
}