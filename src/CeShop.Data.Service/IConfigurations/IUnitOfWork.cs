using System.Threading.Tasks;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.IRepositories;

namespace CeShop.Data.Service.IConfigurations
{
    public interface IUnitOfWork
    {
        IRefreshTokensRepository RefreshTokens { get; }
        ICategoriesRepository Categories { get; }
        IGoodsTypesRepository GoodsTypes { get; }
        IGoodsRepository Goods { get; }
        IGoodsSkusRepository GoodsSkus { get; }
        IUserProfilesRepository UserProfiles { get; }
        ICartsRepository Carts { get; }
        ICartDetailsRepository CartDetails { get; }
        IOrdersRepository Orders { get; }
        IOrderDetailsRepository OrderDetails { get; }
        IInventoriesRepository Inventories { get; }

        Task CompleteAsync();
    }
}