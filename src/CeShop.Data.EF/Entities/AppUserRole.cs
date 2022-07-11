using Microsoft.AspNetCore.Identity;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 使用者與角色關聯表
    /// </summary>
    public class AppUserRole : IdentityUserRole<int>
    {
        public virtual AppUser User { get; set; }
        public virtual AppRole Role { get; set; }
    }
}