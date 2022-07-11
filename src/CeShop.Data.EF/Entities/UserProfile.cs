using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CeShop.Data.EF.Entities
{
    public class UserProfile : BaseEntity
    {
        /// <summary>
        /// 使用者ID
        /// </summary>
        /// <value></value>
        public int UserId { get; set; }

        /// <summary>
        /// 名字
        /// </summary>
        /// <value></value>
        public string UserName { get; set; }

        /// <summary>
        /// 電子信箱
        /// </summary>
        /// <value></value>
        public string Email { get; set; }

        /// <summary>
        /// 居住地
        /// </summary>
        /// <value></value>
        public string Country { get; set; }

        /// <summary>
        /// 住址
        /// </summary>
        /// <value></value>
        public string Address { get; set; }

        /// <summary>
        /// 手機號碼
        /// </summary>
        /// <value></value>
        public string PhoneNumber { get; set; }

        /// <summary>
        /// 生日
        /// </summary>
        /// <value></value>
        public DateTime? BirthDate { get; set; }

        /// <summary>
        /// 性別
        /// </summary>
        /// <value>男性, 女性, 其他</value>
        public string Sex { get; set; }

        [ForeignKey(nameof(UserId))]
        public AppUser User { get; set; }
    }
}