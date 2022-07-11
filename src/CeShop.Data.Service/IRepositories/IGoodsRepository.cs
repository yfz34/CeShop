using System.Collections.Generic;
using System.Threading.Tasks;
using CeShop.Data.EF.Entities;

namespace CeShop.Data.Service.IRepositories
{
    public interface IGoodsRepository : IBaseRepository<Goods>
    {
        /// <summary>
        /// 商品分頁搜索
        /// </summary>
        /// <param name="page">頁碼</param>
        /// <param name="size">頁數量</param>
        /// <param name="desc">排序</param>
        /// <returns></returns>
        public Task<IReadOnlyCollection<Goods>> GetGoodsPaging(int page, int size, bool desc);

        /// <summary>
        /// 透過分類Id尋找商品總數量
        /// </summary>
        /// <param name="categoryId">分類Id</param>
        /// <returns></returns>
        public Task<int> GetGoodsCountInCategory(int categoryId);

        /// <summary>
        /// 透過分類Id尋找商品列表
        /// </summary>
        /// <param name="page">頁碼</param>
        /// <param name="size">頁數量</param>
        /// <param name="desc">排序</param>
        /// <param name="categoryId">分類Id</param>
        /// <returns></returns>
        public Task<IReadOnlyCollection<Goods>> GetGoodsPagingInCategory(int page, int size, bool desc, int categoryId);

        /// <summary>
        /// 商品關鍵字搜索
        /// </summary>
        /// <param name="page">頁碼</param>
        /// <param name="size">頁數量</param>
        /// <param name="desc">排序</param>
        /// <param name="keyword">關鍵字</param>
        /// <returns></returns>
        public Task<IReadOnlyCollection<Goods>> GetGoodsPagingInKeyword(int page, int size, bool desc, string keyword);

        /// <summary>
        /// 取得商品關聯資料
        /// </summary>
        /// <param name="id">商品Id</param>
        /// <returns></returns>
        public Task<Goods> GetDtail(int id);
    }
}