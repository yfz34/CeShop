using System.Collections.Generic;
using System.Threading.Tasks;
using CeShop.Data.EF.Entities;

namespace CeShop.Data.Service.IRepositories
{
    public interface IOrdersRepository : IBaseRepository<Order>
    {
        /// <summary>
        /// 取得所有訂單
        /// </summary>
        /// <returns></returns>
        public Task<IReadOnlyCollection<Order>> GetAll();

        /// <summary>
        /// 取得訂單所有明細
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<Order> GetOrderDetail(int id);

        /// <summary>
        /// 取得使用者所有訂單
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <returns></returns>
        public Task<IReadOnlyCollection<Order>> GetUserOrders(int userId);

        /// <summary>
        /// 刪除訂單關聯
        /// </summary>
        /// <param name="id">OrderId</param>
        /// <returns></returns>
        public Task DeleteOrder(int id);
    }
}