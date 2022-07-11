using System;
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
    public class CartsRepository : EFCoreRepository<Cart>, ICartsRepository
    {
        public CartsRepository(CeShopDbContext dbContext, ILogger logger) : base(dbContext, logger)
        {

        }

        /// <summary>
        /// 取得使用者購物車簡易資料
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <returns>Cart</returns>
        public async Task<Cart> GetUserMiniCart(int userId)
        {
            var userCart = await _dbContext.Carts
                                .AsNoTracking()
                                .Include(c => c.CartDetails.Where(d => d.Status == 1))
                                    .ThenInclude(d => d.GoodsSku)
                                    .ThenInclude(sku => sku.GoodsSkuSpecifications)
                                    .ThenInclude(skuSpec => skuSpec.GoodsSpecification)

                                .Include(c => c.CartDetails.Where(d => d.Status == 1))
                                    .ThenInclude(d => d.GoodsSku)
                                    .ThenInclude(sku => sku.GoodsSkuSpecifications)
                                    .ThenInclude(skuSpec => skuSpec.GoodsSpecificationOption)
                                    .ThenInclude(skuSpecOption => skuSpecOption.Picture)

                                .Include(c => c.CartDetails.Where(d => d.Status == 1))
                                    .ThenInclude(d => d.GoodsSku)
                                    .ThenInclude(sku => sku.Inventory)

                                .Include(c => c.CartDetails.Where(d => d.Status == 1))
                                    .ThenInclude(d => d.Goods)

                                .Where(c => c.UserId == userId)
                                .OrderByDescending(c => c.Id)
                                .Take(3)
                                .AsSplitQuery()
                                .FirstOrDefaultAsync();

            return userCart;
        }

        /// <summary>
        /// 取得使用者購物車所有資料
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <returns></returns>
        public async Task<Cart> GetUserCartDetails(int userId)
        {
            var userCart = await _dbContext.Carts
                                .AsNoTracking()
                                .Include(c => c.CartDetails.Where(d => d.Status == 1))
                                    .ThenInclude(d => d.GoodsSku)
                                    .ThenInclude(sku => sku.GoodsSkuSpecifications)
                                    .ThenInclude(skuSpec => skuSpec.GoodsSpecification)

                                .Include(c => c.CartDetails.Where(d => d.Status == 1))
                                    .ThenInclude(d => d.GoodsSku)
                                    .ThenInclude(sku => sku.GoodsSkuSpecifications)
                                    .ThenInclude(skuSpec => skuSpec.GoodsSpecificationOption)
                                    .ThenInclude(skuSpecOption => skuSpecOption.Picture)

                                .Include(c => c.CartDetails.Where(d => d.Status == 1))
                                    .ThenInclude(d => d.GoodsSku)
                                    .ThenInclude(sku => sku.Inventory)

                                .Include(c => c.CartDetails.Where(d => d.Status == 1))
                                    .ThenInclude(d => d.Goods)

                                .Where(c => c.UserId == userId)
                                .OrderByDescending(c => c.Id)
                                .AsSplitQuery()
                                .FirstOrDefaultAsync();

            return userCart;
        }

        /// <summary>
        /// 取得使用者購物車單筆明細資料
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <param name="detailId">CartDetailId</param>
        /// <returns></returns>
        public async Task<Cart> GetUserCartDetail(int userId, int detailId)
        {
            var userCart = await _dbContext.Carts
                                .AsNoTracking()
                                .Include(c => c.CartDetails.Where(d => d.Id == detailId && d.Status == 1))
                                .ThenInclude(d => d.GoodsSku)
                                .Where(c => c.UserId == userId)
                                .FirstOrDefaultAsync();

            return userCart;
        }

        /// <summary>
        /// 取得使用者購物車關聯貨品資料
        /// </summary>
        /// <param name="userId">使用者ID</param>
        /// <param name="skuId">貨品ID</param>
        /// <returns></returns>
        public async Task<Cart> GetSkuInUserCart(int userId, int skuId)
        {
            try
            {
                var userCart = await _dbContext.Carts
                                .AsNoTracking()
                                .Include(c => c.CartDetails.Where(d => d.Status == 1 && d.GoodsSkuId == skuId))
                                .ThenInclude(d => d.GoodsSku)
                                .Where(c => c.UserId == userId)
                                .FirstOrDefaultAsync();

                return userCart;
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                return null;
            }
        }

        public async Task<Cart> GetUserCartByDetailsIds(int userId, List<int> CartDetailIds)
        {
            var userCart = await _dbContext.Carts
                                .AsNoTracking()
                                .Include(c => c.CartDetails.Where(d => d.Status == 1 && CartDetailIds.ToHashSet().Contains(d.Id)))
                                .OrderBy(c => c.Id)
                                .AsSplitQuery()
                                .FirstOrDefaultAsync();
            return userCart;
        }
    }
}