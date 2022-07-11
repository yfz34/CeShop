using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 使用者
    /// </summary>
    public class AppUser : IdentityUser<int>
    {
        public ICollection<AppUserRole> UserRoles { get; set; }
        public UserProfile UserProfile { get; set; }
        public Cart Cart { get; set; }
        public ICollection<Order> Orders { get; set; }
        public List<RefreshToken> RefreshTokens { get; set; }
    }
}