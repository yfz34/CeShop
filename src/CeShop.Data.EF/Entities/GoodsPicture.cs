using System.Collections.Generic;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 商品照片關聯表
    /// </summary>
    public class GoodsPicture : BaseEntity
    {
        /// <summary>
        /// 順序
        /// </summary>
        /// <value></value>
        public int Sequence { get; set; }

        /// <summary>
        /// 商品ID
        /// </summary>
        /// <value></value>
        public int GoodsId { get; set; }

        public Goods Goods { get; set; }

        /// <summary>
        /// 照片ID
        /// </summary>
        /// <value></value>
        public int PictureId { get; set; }

        public Picture Picture { get; set; }

        /// <summary>
        /// 是否主要照片
        /// </summary>
        /// <value></value>
        public bool IsMain { get; set; }
    }
}