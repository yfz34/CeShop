using System;
using System.Threading.Tasks;
using CeShop.Data.EF.Contexts;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.IConfigurations;
using CeShop.Data.Service.IRepositories;
using CeShop.Data.Service.Repositories;
using Microsoft.Extensions.Logging;

namespace CeShop.Data.Service.Configurations
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly CeShopDbContext _dbContext;
        private readonly ILogger _logger;

        public IRefreshTokensRepository RefreshTokens { get; private set; }
        public ICategoriesRepository Categories { get; private set; }
        public IGoodsTypesRepository GoodsTypes { get; private set; }
        public IGoodsRepository Goods { get; private set; }
        public IGoodsSkusRepository GoodsSkus { get; private set; }
        public IUserProfilesRepository UserProfiles { get; private set; }
        public ICartsRepository Carts { get; private set; }
        public ICartDetailsRepository CartDetails { get; private set; }
        public IOrdersRepository Orders { get; private set; }
        public IOrderDetailsRepository OrderDetails { get; private set; }
        public IInventoriesRepository Inventories { get; private set; }

        public UnitOfWork(CeShopDbContext dbContext, ILoggerFactory loggerFactory)
        {
            _dbContext = dbContext;
            _logger = loggerFactory.CreateLogger("db_logs");

            RefreshTokens = new RefreshTokensRepository(_dbContext, _logger);
            Categories = new CategoriesRepository(_dbContext, _logger);
            GoodsTypes = new GoodsTypesRepository(_dbContext, _logger);
            Goods = new GoodsRepository(_dbContext, _logger);
            GoodsSkus = new GoodsSkusRepository(_dbContext, _logger);
            UserProfiles = new UserProfilesRepository(_dbContext, _logger);
            Carts = new CartsRepository(_dbContext, _logger);
            CartDetails = new CartDetailsRepository(_dbContext, _logger);
            Orders = new OrdersRepository(_dbContext, _logger);
            OrderDetails = new OrderDetailsRepository(_dbContext, _logger);
            Inventories = new InventoriesRepository(_dbContext, _logger);
        }

        public async Task CompleteAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public void Dispose()
        {
            _dbContext.Dispose();
        }
    }
}