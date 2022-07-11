using System.Collections.Generic;
using System.Threading.Tasks;
using CeShop.Data.EF.Entities;

namespace CeShop.Data.Service.IRepositories
{
    public interface IGoodsTypesRepository : IBaseRepository<GoodsType>
    {
        /// <summary>
        /// 取得所有商品類別
        /// </summary>
        /// <returns></returns>
        public Task<List<GoodsType>> GetAll();

        /// <summary>
        /// 取得商品類別關聯資料
        /// </summary>
        /// <param name="id">GoodsTypeId</param>
        /// <returns></returns>
        public Task<GoodsType> GetDtail(int id);

        /// <summary>
        /// 刪除商品類型相關資料
        /// </summary>
        /// <param name="id">GoodsTypeId</param>
        /// <returns></returns>
        public Task DeleteRelated(int id);
    }
}