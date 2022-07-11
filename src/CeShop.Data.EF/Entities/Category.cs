using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 商品分類
    /// </summary>
    public class Category : BaseEntity
    {
        public int? ParentCategoryId { get; set; }

        /// <summary>
        /// 階層
        /// </summary>
        /// <value></value>
        public int Tier { get; set; }

        /// <summary>
        /// 分類名稱
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// 順序
        /// </summary>
        /// <value></value>
        public int Sequence { get; set; }

        public ICollection<Category> SubCategorys { get; set; }
        public Category ParentCategory { get; set; }
        public ICollection<CategoryGoods> CategoryGoodsList { get; set; }
    }
}