using System.Collections.Generic;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 商品類別規格
    /// </summary>
    public class TypeSpecification : BaseEntity
    {
        /// <summary>
        /// 規格名稱
        /// </summary>
        /// <value></value>
        public string Name { get; set; }
        public List<TypeSpecificationOption> TypeSpecificationOptions { get; set; }
    }
}