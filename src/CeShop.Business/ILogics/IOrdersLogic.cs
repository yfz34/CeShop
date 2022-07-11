using System.Collections.Generic;
using System.Threading.Tasks;
using CeShop.Data.EF.Entities;
using CeShop.Domain.Dtos.Generics;
using CeShop.Domain.Dtos.Requests;

namespace CeShop.Business.ILogics
{
    /// <summary>
    /// 訂單管理邏輯處理介面
    /// </summary>
    public interface IOrdersLogic
    {
        /// <summary>
        /// 取得所有訂單資料
        /// </summary>
        /// <returns></returns>
        public Task<IReadOnlyCollection<Order>> GetAllAsync();

        /// <summary>
        /// 透過OrderId取得訂單詳細資料
        /// </summary>
        /// <param name="id">OrderId</param>
        /// <returns></returns>
        public Task<Order> GetByIdAsync(int id);

        /// <summary>
        /// 透過OrderId刪除訂單
        /// </summary>
        /// <param name="id">OrderId</param>
        /// <returns></returns>
        public Task DeleteByIdAsync(int id);

        /// <summary>
        /// 取得使用者所有訂單資料
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <returns></returns>
        public Task<IReadOnlyCollection<Order>> GetUserOrdersAsync(int userId);

        /// <summary>
        /// 新增使用者訂單
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <param name="userOrderPostRequestDto">新增訂單物件</param>
        /// <returns></returns>
        public Task<Result<string>> CreateUserOrder(int userId, UserOrderPostRequestDto userOrderPostRequestDto);
    }
}