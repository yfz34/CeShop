using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace CeShop.Data.EF.Entities
{
    public class RefreshToken : BaseEntity
    {
        /// <summary>
        /// 使用者ID
        /// </summary>
        /// <value></value>
        public int UserId { get; set; }

        /// <summary>
        /// JWT Id
        /// </summary>
        /// <value></value>
        public string JwtId { get; set; }

        /// <summary>
        /// Refresh Token
        /// </summary>
        /// <value></value>
        public string Token { get; set; }

        /// <summary>
        /// 過期時間
        /// </summary>
        /// <value></value>
        public DateTime ExpiryTime { get; set; }

        /// <summary>
        /// 建立時間
        /// </summary>
        /// <value></value>
        public DateTime CreatedTime { get; set; }

        /// <summary>
        /// 建立IP
        /// </summary>
        /// <value></value>
        public string CreatedByIp { get; set; }

        /// <summary>
        /// 是否使用
        /// </summary>
        /// <value></value>
        public bool IsUsed { get; set; } // To make sure that the token is only used once

        /// <summary>
        /// 使用時間
        /// </summary>
        /// <value></value>
        public DateTime UsedTime { get; set; }

        /// <summary>
        /// 使用IP
        /// </summary>
        /// <value></value>
        public string UsedByIp { get; set; }

        /// <summary>
        /// 是否撤銷
        /// </summary>
        /// <value></value>
        public bool IsRevoked { get; set; }

        /// <summary>
        /// 撤銷時間
        /// </summary>
        /// <value></value>
        public DateTime RevokedTime { get; set; }

        /// <summary>
        /// 撤銷IP
        /// </summary>
        /// <value></value>
        public string RevokedByIp { get; set; }

        [ForeignKey(nameof(UserId))]
        public AppUser User { get; set; }
    }
}