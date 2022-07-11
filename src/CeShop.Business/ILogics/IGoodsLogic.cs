using System.Collections.Generic;
using System.Threading.Tasks;
using CeShop.Data.EF.Entities;
using CeShop.Domain.Dtos.Requests;

namespace CeShop.Business.ILogics
{
    /// <summary>
    /// 商品管理邏輯處理介面
    /// </summary>
    public interface IGoodsLogic
    {
        /// <summary>
        /// 取得所有商品資料邏輯處理
        /// </summary>
        /// <returns></returns>
        public Task<IReadOnlyCollection<Goods>> GetAllAsync();

        /// <summary>
        /// 透過GoodsId取的商品詳細資料邏輯處理
        /// </summary>
        /// <param name="id">GoodsId</param>
        /// <returns></returns>
        public Task<Goods> GetByIdAsync(int id);

        /// <summary>
        /// 新增商品資料邏輯處理
        /// </summary>
        /// <param name="goodsPostRequestDto">新增商品物件</param>
        /// <returns></returns>
        public Task CreateAsync(GoodsPostRequestDto goodsPostRequestDto);

        /// <summary>
        /// 更新商品上下架邏輯處理
        /// </summary>
        /// <param name="id">GoodsId</param>
        /// <param name="isShelf">是否上架</param>
        /// <returns></returns>
        public Task UpdateStatusAsync(int id, bool isShelf);

        /// <summary>
        /// 透過GoodsId刪除資料邏輯處理
        /// </summary>
        /// <param name="id">GoodsId</param>
        /// <returns></returns>
        public Task DeleteAsync(int id);
    }
}