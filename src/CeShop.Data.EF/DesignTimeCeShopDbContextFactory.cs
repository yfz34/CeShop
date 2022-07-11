using CeShop.Data.EF.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CeShop.Data.EF
{
    public class DesignTimeCeShopDbContextFactory : IDesignTimeDbContextFactory<CeShopDbContext>
    {
        public CeShopDbContext CreateDbContext(string[] args)
        {
            var dbContextBuilder = new DbContextOptionsBuilder<CeShopDbContext>();

            // var connectionString = "server=;uid=;pwd=;database=CeShop;";
            // var connectionString = "Server=127.0.0.1;Port=5433;Database=CeShop;User Id=postgres;Password=;";
            var connectionString = "Server=;Port=5432;Database=CeShop;User Id=postgres;Password=;";

            // dbContextBuilder.UseSqlServer(connectionString);
            dbContextBuilder.UseNpgsql(connectionString);

            return new CeShopDbContext(dbContextBuilder.Options);
        }
    }
}