using System.Collections.Generic;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 商品類別屬性表
    /// </summary>
    public class TypeAttribute : BaseEntity
    {
        /// <summary>
        /// 屬性名稱
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        public ICollection<TypeAttributeOption> TypeAttributeOptions { get; set; }
    }
}