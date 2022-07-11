using System.Collections.Generic;
using System.Threading.Tasks;
using CeShop.Data.EF.Entities;
using CeShop.Domain.Dtos.Requests;

namespace CeShop.Business.ILogics
{
    /// <summary>
    /// 商品類型管理邏輯處理介面
    /// </summary>
    public interface IGoodsTypesLogic
    {
        /// <summary>
        /// 取得所有商品類型資料邏輯處理
        /// </summary>
        /// <returns></returns>
        public Task<List<GoodsType>> GetAllAsync();

        /// <summary>
        /// 透過Id取得商品類型詳細資料邏輯處理
        /// </summary>
        /// <param name="id">商品類型Id</param>
        /// <returns></returns>
        public Task<GoodsType> GetByIdAsync(int id);

        /// <summary>
        /// 新增商品類型資料邏輯處理
        /// </summary>
        /// <param name="goodsTypePostRequestDto">新增商品類型物件</param>
        /// <returns></returns>
        public Task CreateAsync(GoodsTypePostRequestDto goodsTypePostRequestDto);

        /// <summary>
        /// 透過Id刪除商品類型資料邏輯處理
        /// </summary>
        /// <param name="id">商品類型Id</param>
        /// <returns></returns>
        public Task DeleteAsync(int id);
    }
}