using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 商品資訊
    /// </summary>
    public class Goods : BaseEntity
    {
        /// <summary>
        /// 商品代碼
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 商品名稱
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 商品描述
        /// </summary>
        // [Column(TypeName = "ntext")]
        public string Description { get; set; }

        /// <summary>
        /// 排序
        /// </summary>
        public int Sequence { get; set; }

        /// <summary>
        /// 狀態(0: 下架, 1: 上架, -1: 刪除)
        /// </summary>
        public int Status { get; set; }

        /// <summary>
        /// 商品重量
        /// </summary>
        /// <value></value>
        [Column(TypeName = "decimal(7, 4)")]
        public decimal Weight { get; set; }

        /// <summary>
        /// 商品單位
        /// </summary>
        public string Unit { get; set; }

        /// <summary>
        /// 原始價錢
        /// </summary>
        /// <value></value>
        [Column(TypeName = "decimal(9, 2)")]
        public decimal OriginPrice { get; set; }

        /// <summary>
        /// 販賣價錢
        /// </summary>
        [Column(TypeName = "decimal(9, 2)")]
        public decimal SellPrice { get; set; }

        /// <summary>
        /// 存貨量
        /// </summary>
        public int Stock { get; set; }

        /// <summary>
        /// 商品照片
        /// </summary>
        public string MainPictureName { get; set; }

        /// <summary>
        /// 商品類別ID
        /// </summary>
        public int? GoodsTypeId { get; set; }

        public ICollection<CategoryGoods> CategoryGoodsList { get; set; }

        public ICollection<GoodsAttribute> GoodsAttributes { get; set; }

        public ICollection<GoodsSpecification> GoodsSpecifications { get; set; }

        public ICollection<GoodsPicture> GoodsPictures { get; set; }

        public GoodsType GoodsType { get; set; }

        public ICollection<GoodsSku> GoodsSkus { get; set; }
    }
}