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
    public class GoodsRepository : EFCoreRepository<Goods>, IGoodsRepository
    {
        public GoodsRepository(CeShopDbContext dbContext, ILogger logger) : base(dbContext, logger)
        {

        }

        /// <summary>
        /// 商品分頁搜索
        /// </summary>
        /// <param name="page">頁碼</param>
        /// <param name="size">頁數量</param>
        /// <param name="desc">排序</param>
        /// <returns></returns>
        public async Task<IReadOnlyCollection<Goods>> GetGoodsPaging(int page, int size, bool desc)
        {
            IQueryable<Goods> goodsIQ = _dbContext.Goods.Where(g => g.Status == 1);

            goodsIQ = desc ? goodsIQ.OrderByDescending(g => g.Id) : goodsIQ.OrderBy(g => g.Id);

            goodsIQ = goodsIQ.Skip((page - 1) * size).Take(size);

            // _logger.LogInformation($"Using Paging:\n{goodsIQ.ToQueryString()}");

            return await goodsIQ.AsNoTracking().ToListAsync();
        }

        /// <summary>
        /// 透過分類Id尋找商品總數量
        /// </summary>
        /// <param name="categoryId">分類Id</param>
        /// <returns></returns>
        public async Task<int> GetGoodsCountInCategory(int categoryId)
        {
            IQueryable<Goods> goodsIQ = _dbContext.Goods.Where(g => g.Status == 1);

            goodsIQ = from category in _dbContext.Categories
                      join categoryGoods in _dbContext.CategoryGoods
                          on category.Id equals categoryGoods.CategoryId
                      join goods in _dbContext.Goods
                          on categoryGoods.GoodsId equals goods.Id
                      where category.Id == categoryId
                      select goods;

            // _logger.LogInformation($"Using Paging:\n{goodsIQ.ToQueryString()}");

            return await goodsIQ.AsNoTracking().CountAsync();
        }

        /// <summary>
        /// 透過分類Id尋找商品列表
        /// </summary>
        /// <param name="page">頁碼</param>
        /// <param name="size">頁數量</param>
        /// <param name="desc">排序</param>
        /// <param name="categoryId">分類Id</param>
        /// <returns></returns>
        public async Task<IReadOnlyCollection<Goods>> GetGoodsPagingInCategory(int page, int size, bool desc, int categoryId)
        {
            IQueryable<Goods> goodsIQ = _dbContext.Goods.Where(g => g.Status == 1);

            goodsIQ = from category in _dbContext.Categories
                      join categoryGoods in _dbContext.CategoryGoods
                          on category.Id equals categoryGoods.CategoryId
                      join goods in _dbContext.Goods
                          on categoryGoods.GoodsId equals goods.Id
                      where category.Id == categoryId
                      select goods;

            goodsIQ = desc ? goodsIQ.OrderByDescending(g => g.Id) : goodsIQ.OrderBy(g => g.Id);

            goodsIQ = goodsIQ.Skip((page - 1) * size).Take(size);

            // _logger.LogInformation($"Using Paging:\n{goodsIQ.ToQueryString()}");

            return await goodsIQ.AsNoTracking().ToListAsync();
        }

        /// <summary>
        /// 商品關鍵字搜索
        /// </summary>
        /// <param name="page">頁碼</param>
        /// <param name="size">頁數量</param>
        /// <param name="desc">排序</param>
        /// <param name="keyword">關鍵字</param>
        /// <returns></returns>
        public async Task<IReadOnlyCollection<Goods>> GetGoodsPagingInKeyword(int page, int size, bool desc, string keyword)
        {
            IQueryable<Goods> goodsIQ = _dbContext.Goods.Where(g => g.Status == 1);

            goodsIQ = goodsIQ.Where(g => Microsoft.EntityFrameworkCore.EF.Functions.Like(g.Name, $"%{keyword}%"));

            goodsIQ = desc ? goodsIQ.OrderByDescending(g => g.Id) : goodsIQ.OrderBy(g => g.Id);

            goodsIQ = goodsIQ.Skip((page - 1) * size).Take(size);

            // _logger.LogInformation($"Using Paging:\n{goodsIQ.ToQueryString()}");

            return await goodsIQ.AsNoTracking().ToListAsync();
        }

        /// <summary>
        /// 取得商品關聯資料
        /// </summary>
        /// <param name="id">商品Id</param>
        /// <returns></returns>
        public async Task<Goods> GetDtail(int id)
        {
            var goods = await _dbContext.Goods
                .OrderBy(goods => goods.Id)

                .Include(goods => goods.CategoryGoodsList)
                    .ThenInclude(categoryGoods => categoryGoods.Category)

                .Include(goods => goods.GoodsSkus)
                    .ThenInclude(sku => sku.Inventory)

                .Include(goods => goods.GoodsSkus)
                    .ThenInclude(sku => sku.GoodsSkuSpecifications)

                .Include(goods => goods.GoodsSpecifications)
                    .ThenInclude(goodsSpecification => goodsSpecification.GoodsSpecificationOptions)
                        .ThenInclude(goodsSpecificationOption => goodsSpecificationOption.Picture)

                .Include(goods => goods.GoodsAttributes)

                .Include(goods => goods.GoodsPictures)
                    .ThenInclude(goodsPicture => goodsPicture.Picture)

                .AsSplitQuery()
                .SingleOrDefaultAsync(goods => goods.Id == id);

            goods.CategoryGoodsList = goods.CategoryGoodsList.OrderBy(categoryGoods => categoryGoods.Category.Tier).ToList();

            goods.GoodsSkus = goods.GoodsSkus.OrderBy(goodsSku => goodsSku.Sequence).ToList();
            // goods.GoodsSkus = goods.GoodsSkus.OrderBy(sku => sku.GoodsSkuSpecifications.OrderBy(spec => spec.GoodsSpecification.Sequence)).ToList();

            goods.GoodsSpecifications = goods.GoodsSpecifications.OrderBy(goodsSpecification => goodsSpecification.Sequence).ThenBy(goodsSpecification => goodsSpecification.GoodsSpecificationOptions.OrderBy(options => options.Seqence)).ToList();

            goods.GoodsAttributes = goods.GoodsAttributes.OrderBy(goodsAttribute => goodsAttribute.Sequence).ToList();

            goods.GoodsPictures = goods.GoodsPictures.OrderBy(goodsPicture => goodsPicture.Sequence).ToList();

            return goods;
        }
    }
}