using System.Collections.Generic;
using System.Threading.Tasks;
using CeShop.Data.EF.Entities;

namespace CeShop.Data.Service.IRepositories
{
    public interface IGoodsSkusRepository : IBaseRepository<GoodsSku>
    {
        /// <summary>
        /// 取得貨品詳細資料
        /// </summary>
        /// <param name="id">貨品ID</param>
        /// <returns></returns>
        public Task<GoodsSku> GetDetail(int id);
    }
}