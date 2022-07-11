using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 商品規格選項
    /// </summary>
    public class GoodsSpecificationOption : BaseEntity
    {
        /// <summary>
        /// 商品規格ID
        /// </summary>
        /// <value></value>
        public int GoodsSpecificationId { get; set; }

        /// <summary>
        /// 規格選項名稱
        /// </summary>
        /// <value></value>
        public string Value { get; set; }

        /// <summary>
        /// 順序
        /// </summary>
        /// <value></value>
        public int Seqence { get; set; }

        /// <summary>
        /// 照片ID
        /// </summary>
        /// <value></value>
        public int? PictureId { get; set; }

        public Picture Picture { get; set; }

        public GoodsSpecification GoodsSpecification { get; set; }
    }
}