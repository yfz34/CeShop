using System.Collections.Generic;
using System.Threading.Tasks;
using CeShop.Data.EF.Entities;
using CeShop.Domain.Dtos.Requests;

namespace CeShop.Business.ILogics
{
    /// <summary>
    /// 使用者購物車邏輯處理介面
    /// </summary>
    public interface ICartsLogic
    {
        /// <summary>
        /// 取得使用者購物車簡易資料邏輯處理
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <returns>CartDetail List</returns>
        public Task<List<CartDetail>> GetUserMiniCartAsync(int userId);

        /// <summary>
        /// 取得使用者購物車資料筆數邏輯處理
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <returns>資料筆數</returns>
        public Task<int> GetUserCartDetailCountAsync(int userId);

        /// <summary>
        /// 取得使用者購物車所有資料邏輯處理
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <returns>CartDetail List</returns>
        public Task<List<CartDetail>> GetUserCartAsync(int userId);

        /// <summary>
        /// 增加或更新使用者購物車資料邏輯處理
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <param name="cartPostRequestDto">新增物件</param>
        /// <returns>CartDetail</returns>
        public Task<CartDetail> AddUserCartAsync(int userId, CartPostRequestDto cartPostRequestDto);

        /// <summary>
        /// 更新使用者購物車資料邏輯處理
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <param name="cartPutRequestDto">更新物件</param>
        /// <returns>CartDetail</returns>
        public Task<CartDetail> UpdateUserChartDetailAsync(int userId, CartPutRequestDto cartPutRequestDto);

        /// <summary>
        /// 刪除使用者購物車資料邏輯處理
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <param name="detailId">Cart Detail Id</param>
        /// <returns></returns>
        public Task DeleteUserCartDetail(int userId, int detailId);
    }
}