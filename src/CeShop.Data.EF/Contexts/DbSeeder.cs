using System;
using System.Collections.Generic;
using CeShop.Data.EF.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CeShop.Data.EF.Contexts
{
    public static class DbSeeder
    {
        public static void Seed(this ModelBuilder builder)
        {
            SeedRoles(builder);
            SeedAdmin(builder);
            SeedTestUser(builder);
        }

        /// <summary>
        /// 建立角色資料列表
        /// </summary>
        private static void SeedRoles(ModelBuilder builder)
        {
            var appRoles = new List<AppRole> {
                new AppRole
                {
                    Id = 1,
                    Name = "Admin",
                    NormalizedName = "admin".ToUpper(),
                    CName = "系統管理員"
                },
                new AppRole
                {
                    Id = 2,
                    Name = "Customer",
                    NormalizedName = "Customer".ToUpper(),
                    CName = "顧客"
                }
            };

            builder.Entity<AppRole>().HasData(appRoles);
        }

        /// <summary>
        /// 建立測試使用者
        /// </summary>
        private static void SeedTestUser(ModelBuilder builder)
        {
            var ph = new PasswordHasher<AppUser>();
            AppUser user = new AppUser
            {
                Id = 2,
                UserName = "test",
                NormalizedUserName = "test".ToUpper(),
                Email = "test@example.com",
                NormalizedEmail = "test@example.com".ToUpper(),
                EmailConfirmed = true
            };
            user.PasswordHash = ph.HashPassword(user, "Test123");
            builder.Entity<AppUser>().HasData(user);

            builder.Entity<AppUserRole>().HasData(
                new IdentityUserRole<int>
                {
                    RoleId = 2,
                    UserId = 2
                });

            builder.Entity<UserProfile>().HasData(
                new UserProfile
                {
                    Id = 2,
                    UserId = 2,
                    UserName = "測試人員",
                    Email = "test@example.com",
                    CreateTime = DateTime.UtcNow,
                    UpdateTime = DateTime.UtcNow
                });

            builder.Entity<Cart>().HasData(
                new Cart
                {
                    Id = 2,
                    UserId = 2,
                    CreateTime = DateTime.UtcNow,
                    UpdateTime = DateTime.UtcNow
                });
        }

        /// <summary>
        /// 建立系統管理員
        /// </summary>
        private static void SeedAdmin(ModelBuilder builder)
        {
            var ph = new PasswordHasher<AppUser>();
            AppUser user = new AppUser
            {
                Id = 1,
                UserName = "admin",
                NormalizedUserName = "admin".ToUpper(),
                Email = "admin@example.com",
                NormalizedEmail = "admin@example.com".ToUpper(),
                EmailConfirmed = true
            };
            user.PasswordHash = ph.HashPassword(user, "Admin123");
            builder.Entity<AppUser>().HasData(user);

            builder.Entity<AppUserRole>().HasData(
                new IdentityUserRole<int>
                {
                    RoleId = 1,
                    UserId = 1
                },
                new IdentityUserRole<int>
                {
                    RoleId = 2,
                    UserId = 1
                });

            builder.Entity<UserProfile>().HasData(
                new UserProfile
                {
                    Id = 1,
                    UserId = 1,
                    UserName = "系統管理者",
                    Email = "admin@example.com",
                    CreateTime = DateTime.UtcNow,
                    UpdateTime = DateTime.UtcNow
                });

            builder.Entity<Cart>().HasData(
                new Cart
                {
                    Id = 1,
                    UserId = 1,
                    CreateTime = DateTime.UtcNow,
                    UpdateTime = DateTime.UtcNow
                });
        }
    }
}