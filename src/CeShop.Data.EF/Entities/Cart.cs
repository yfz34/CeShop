using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 購物車
    /// </summary>
    public class Cart : BaseEntity
    {
        /// <summary>
        /// 使用者ID
        /// </summary>
        /// <value></value>
        public int UserId { get; set; }

        public ICollection<CartDetail> CartDetails { get; set; }

        [ForeignKey(nameof(UserId))]
        public AppUser User { get; set; }
    }
}