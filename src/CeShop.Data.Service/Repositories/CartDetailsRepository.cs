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
    public class CartDetailsRepository : EFCoreRepository<CartDetail>, ICartDetailsRepository
    {
        public CartDetailsRepository(CeShopDbContext dbContext, ILogger logger) : base(dbContext, logger)
        {
        }

        /// <summary>
        /// 指定取得使用者購物車明細
        /// </summary>
        /// <param name="cartId">購物車ID</param>
        /// <param name="CartDetailIds">CartDetailId List</param>
        /// <returns></returns>
        public async Task<List<CartDetail>> GetUserCartByDetailsIds(int cartId, List<int> CartDetailIds)
        {
            var userCartDetails = await _dbContext.CartDetails
                                .Include(detail => detail.Goods)
                                .Include(detail => detail.GoodsSku)
                                    .ThenInclude(sku => sku.Inventory)
                                .Include(detail => detail.GoodsSku)
                                    .ThenInclude(sku => sku.GoodsSkuSpecifications)
                                    .ThenInclude(skuSpec => skuSpec.GoodsSpecificationOption)
                                    .ThenInclude(skuSpecOption => skuSpecOption.Picture)
                                .Include(detail => detail.GoodsSku)
                                    .ThenInclude(sku => sku.GoodsSkuSpecifications)
                                    .ThenInclude(skuSpec => skuSpec.GoodsSpecification)
                                .Where(d => d.Status == 1 && CartDetailIds.ToHashSet().Contains(d.Id))
                                .OrderBy(c => c.Id)
                                .AsSplitQuery()
                                .ToListAsync();

            return userCartDetails;
        }
    }
}