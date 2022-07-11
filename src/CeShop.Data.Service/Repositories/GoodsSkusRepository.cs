using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CeShop.Data.EF.Contexts;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.IRepositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CeShop.Data.Service.Repositories
{
    public class GoodsSkusRepository : EFCoreRepository<GoodsSku>, IGoodsSkusRepository
    {
        public GoodsSkusRepository(CeShopDbContext dbContext, ILogger logger) : base(dbContext, logger)
        {

        }

        /// <summary>
        /// 取得貨品詳細資料
        /// </summary>
        /// <param name="id">貨品ID</param>
        /// <returns></returns>
        public async Task<GoodsSku> GetDetail(int id)
        {
            return await _dbContext.GoodsSkus
                            .Where(sku => sku.Id == id && sku.Status == 1)
                            .Include(sku => sku.Inventory)
                            .AsNoTracking()
                            .SingleOrDefaultAsync();
        }
    }
}