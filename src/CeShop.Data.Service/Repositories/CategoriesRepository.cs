using System.Threading.Tasks;
using CeShop.Data.EF.Contexts;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.IRepositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CeShop.Data.Service.Repositories
{
    public class CategoriesRepository : EFCoreRepository<Category>, ICategoriesRepository
    {
        public CategoriesRepository(CeShopDbContext dbContext, ILogger logger) : base(dbContext, logger)
        {

        }

        /// <summary>
        /// 取得分類與子分類資料
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Category> GetDetail(int id)
        {
            var goods = await _dbContext.Categories
                .Include(category => category.SubCategorys)
                .FirstOrDefaultAsync(goodsType => goodsType.Id == id);

            return goods;
        }
    }
}