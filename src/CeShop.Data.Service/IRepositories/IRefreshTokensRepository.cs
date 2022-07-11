using System.Threading.Tasks;
using CeShop.Data.EF.Entities;

namespace CeShop.Data.Service.IRepositories
{
    public interface IRefreshTokensRepository : IBaseRepository<RefreshToken>
    {
        /// <summary>
        /// 標註RefreshToken已被使用
        /// </summary>
        /// <param name="refreshToken">RefreshToken</param>
        /// <param name="ipAddress">IP位置</param>
        /// <returns></returns>        
        Task<bool> MarkRefreshTokenAsUsed(RefreshToken refreshToken, string ipAddress);
    }
}