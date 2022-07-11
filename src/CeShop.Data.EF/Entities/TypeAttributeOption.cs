namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 商品類別屬性選項表
    /// </summary>
    public class TypeAttributeOption : BaseEntity
    {
        /// <summary>
        /// 商品類別屬性ID
        /// </summary>
        /// <value></value>
        public int TypeAttributeId { get; set; }

        /// <summary>
        /// 商品類別屬性選項名稱
        /// </summary>
        /// <value></value>
        public string Value { get; set; }
    }
}