namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 商品類別規格選項表
    /// </summary>
    public class TypeSpecificationOption : BaseEntity
    {
        /// <summary>
        /// 商品類別規格ID
        /// </summary>
        /// <value></value>
        public int TypeSpecificationId { get; set; }

        /// <summary>
        /// 商品類別規格選項名稱
        /// </summary>
        /// <value></value>
        public string Value { get; set; }
    }
}