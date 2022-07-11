using System;
using System.Linq;
using System.Threading.Tasks;
using CeShop.Data.EF.Contexts;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.IRepositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CeShop.Data.Service.Repositories
{
    public class RefreshTokensRepository : EFCoreRepository<RefreshToken>, IRefreshTokensRepository
    {
        public RefreshTokensRepository(CeShopDbContext dbContext, ILogger logger) : base(dbContext, logger)
        {
        }

        /// <summary>
        /// 標註RefreshToken已被使用
        /// </summary>
        /// <param name="refreshToken">RefreshToken</param>
        /// <param name="ipAddress">IP位置</param>
        /// <returns></returns>
        public async Task<bool> MarkRefreshTokenAsUsed(RefreshToken refreshToken, string ipAddress)
        {
            try
            {
                var token = await dbSet.Where(x => x.Token.ToLower() == refreshToken.Token.ToLower()).AsNoTracking().FirstOrDefaultAsync();

                if (token == null)
                    return false;

                token.IsUsed = true;
                token.UsedByIp = ipAddress;
                token.UsedTime = DateTime.UtcNow;

                dbSet.Update(token);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{Repo} MarkRefreshTokenAsUsed method has generated an error", typeof(RefreshTokensRepository));
                return false;
            }
        }
    }
}