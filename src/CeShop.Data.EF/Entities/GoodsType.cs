using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 商品類型
    /// </summary>
    public class GoodsType : BaseEntity
    {
        /// <summary>
        /// 類型名稱
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// 順序
        /// </summary>
        /// <value></value>
        public int Sequence { get; set; }

        public ICollection<TypeAttribute> TypeAttributes { get; set; }
        public ICollection<TypeSpecification> TypeSpecifications { get; set; }
        public ICollection<Goods> Goods { get; set; }
    }
}