using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 角色
    /// </summary>
    public class AppRole : IdentityRole<int>
    {
        /// <summary>
        /// 中文名稱
        /// </summary>
        /// <value></value>
        public string CName { get; set; }

        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}