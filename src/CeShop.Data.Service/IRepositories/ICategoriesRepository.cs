using System.Threading.Tasks;
using CeShop.Data.EF.Entities;

namespace CeShop.Data.Service.IRepositories
{
    public interface ICategoriesRepository : IBaseRepository<Category>
    {
        /// <summary>
        /// 取得分類與子分類資料
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<Category> GetDetail(int id);
    }
}