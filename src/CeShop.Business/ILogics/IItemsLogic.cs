using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CeShop.Data.EF.Entities;

namespace CeShop.Business.ILogics
{
    /// <summary>
    /// 商品查找邏輯處理介面
    /// </summary>
    public interface IItemsLogic
    {
        /// <summary>
        /// 商品分頁搜索邏輯處理
        /// </summary>
        /// <param name="page">頁碼</param>
        /// <param name="size">一頁多少筆</param>
        /// <param name="order">排序方式(desc or asc)</param>
        /// <param name="categoryId">分類ID</param>
        /// <param name="keyword">關鍵字</param>
        /// <returns></returns>
        public Task<Tuple<int, IReadOnlyCollection<Goods>>> GetGoodsListOfPagingAsync(int page, int size, string order, int? categoryId, string keyword);

        /// <summary>
        /// 透過GoodsSkuId取得貨品資料邏輯處理
        /// </summary>
        /// <param name="id">GoodsSkuId</param>
        /// <returns></returns>
        public Task<GoodsSku> GetGoodsSkuByIdAsync(int id);

        /// <summary>
        /// 透過GoodsId取得商品資料邏輯處理
        /// </summary>
        /// <param name="id">GoodsId</param>
        /// <returns></returns>
        public Task<Goods> GetGoodsById(int id);
    }
}