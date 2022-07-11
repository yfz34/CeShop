using System.Threading.Tasks;
using CeShop.Data.EF.Contexts;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.IRepositories;
using Microsoft.Extensions.Logging;

namespace CeShop.Data.Service.Repositories
{
    public class UserProfilesRepository : EFCoreRepository<UserProfile>, IUserProfilesRepository
    {
        public UserProfilesRepository(CeShopDbContext dbContext, ILogger logger) : base(dbContext, logger)
        {
            
        }
    }
}