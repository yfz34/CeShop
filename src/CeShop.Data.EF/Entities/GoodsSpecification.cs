using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 商品規格
    /// </summary>
    public class GoodsSpecification : BaseEntity
    {
        /// <summary>
        /// 規格名稱
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// 順序
        /// </summary>
        /// <value></value>
        public int Sequence { get; set; }

        public ICollection<GoodsSpecificationOption> GoodsSpecificationOptions { get; set; }
    }
}