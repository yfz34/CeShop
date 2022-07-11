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
    public class GoodsTypesRepository : EFCoreRepository<GoodsType>, IGoodsTypesRepository
    {
        public GoodsTypesRepository(CeShopDbContext dbContext, ILogger logger) : base(dbContext, logger)
        {

        }

        /// <summary>
        /// 刪除商品類型相關資料
        /// </summary>
        /// <param name="id">GoodsTypeId</param>
        /// <returns></returns>
        public async Task DeleteRelated(int id)
        {
            var goodsType = await GetDtail(id);
            _dbContext.GoodsTypes.Remove(goodsType);
        }

        /// <summary>
        /// 取得所有商品類別
        /// </summary>
        /// <returns></returns>
        public async Task<List<GoodsType>> GetAll()
        {
            var goodsTypes = await _dbContext.GoodsTypes
                .AsNoTracking()
                .Include(goodsType => goodsType.TypeAttributes)
                    .ThenInclude(typeAttribute => typeAttribute.TypeAttributeOptions)
                .Include(goodsType => goodsType.TypeSpecifications)
                    .ThenInclude(typeSpecification => typeSpecification.TypeSpecificationOptions)
                .AsSplitQuery()
                .ToListAsync();

            return goodsTypes;
        }

        /// <summary>
        /// 取得商品類別關聯資料
        /// </summary>
        /// <param name="id">GoodsTypeId</param>
        /// <returns></returns>
        public async Task<GoodsType> GetDtail(int id)
        {
            var goodsTypesDetail = await _dbContext.GoodsTypes
                .AsNoTracking()
                .OrderBy(goodsType => goodsType.Id)
                .Include(goodsType => goodsType.TypeAttributes)
                    .ThenInclude(typeAttribute => typeAttribute.TypeAttributeOptions)
                .Include(goodsType => goodsType.TypeSpecifications)
                    .ThenInclude(typeSpecification => typeSpecification.TypeSpecificationOptions)
                .AsSplitQuery()
                .SingleOrDefaultAsync(goodsType => goodsType.Id == id);

            return goodsTypesDetail;
        }
    }
}