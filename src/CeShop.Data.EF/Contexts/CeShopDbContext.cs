using System;
using CeShop.Data.EF.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CeShop.Data.EF.Contexts
{
    public class CeShopDbContext : IdentityDbContext<AppUser, AppRole, int, IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public CeShopDbContext(DbContextOptions<CeShopDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>().ToTable("AppUsers");
            modelBuilder.Entity<IdentityUserClaim<int>>().ToTable("AppUserClaims");
            modelBuilder.Entity<IdentityUserLogin<int>>().ToTable("AppUserLogins");
            modelBuilder.Entity<IdentityUserToken<int>>().ToTable("AppUserTokens");
            modelBuilder.Entity<AppRole>().ToTable("AppRoles");
            modelBuilder.Entity<IdentityRoleClaim<int>>().ToTable("AppRoleClaims");
            modelBuilder.Entity<AppUserRole>().ToTable("AppUserRoles");

            modelBuilder.Entity<AppUserRole>(userRole =>
            {
                userRole.HasKey(ur => new { ur.UserId, ur.RoleId });

                userRole.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();

                userRole.HasOne(ur => ur.User)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();
            });

            modelBuilder.Entity<CartDetail>()
                .HasOne(d => d.GoodsSku)
                .WithMany()
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<CartDetail>()
                .HasOne(d => d.GoodsSku)
                .WithMany()
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<OrderDetail>()
                .HasOne(d => d.GoodsSku)
                .WithMany()
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<OrderDetail>()
                .HasOne(d => d.Goods)
                .WithMany()
                .OnDelete(DeleteBehavior.NoAction);

            DbSeeder.Seed(modelBuilder);
        }

        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }

        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartDetail> CartDetails { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<CategoryGoods> CategoryGoods { get; set; }
        public DbSet<Goods> Goods { get; set; }
        public DbSet<GoodsAttribute> GoodsAttributes { get; set; }
        public DbSet<GoodsPicture> GoodsPictures { get; set; }
        public DbSet<GoodsSku> GoodsSkus { get; set; }
        public DbSet<GoodsSpecification> GoodsSpecifications { get; set; }
        public DbSet<GoodsSpecificationOption> GoodsSpecificationOptions { get; set; }
        public DbSet<GoodsType> GoodsTypes { get; set; }
        public DbSet<Inventory> Inventorys { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Picture> Pictures { get; set; }
        public DbSet<TypeAttribute> TypeAttributes { get; set; }
        public DbSet<TypeAttributeOption> TypeAttributeOptions { get; set; }
        public DbSet<TypeSpecification> TypeSpecifications { get; set; }
        public DbSet<TypeSpecificationOption> TypeSpecificationOptions { get; set; }
    }
}