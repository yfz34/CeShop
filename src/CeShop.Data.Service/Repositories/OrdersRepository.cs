using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CeShop.Data.EF.Contexts;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.IRepositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CeShop.Data.Service.Repositories
{
    public class OrdersRepository : EFCoreRepository<Order>, IOrdersRepository
    {
        public OrdersRepository(CeShopDbContext dbContext, ILogger logger) : base(dbContext, logger)
        {
        }

        /// <summary>
        /// 刪除訂單關聯
        /// </summary>
        /// <param name="id">OrderId</param>
        /// <returns></returns>
        public async Task DeleteOrder(int id)
        {
            var order = await _dbContext.Orders
                                .Include(order => order.OrderDetails)
                                .Where(order => order.Id == id)
                                .FirstOrDefaultAsync();
            _dbContext.Orders.Remove(order);
        }

        /// <summary>
        /// 取得所有訂單
        /// </summary>
        /// <returns></returns>
        public async Task<IReadOnlyCollection<Order>> GetAll()
        {
            var orders = await _dbContext.Orders
                                .AsNoTracking()
                                .Include(order => order.User)
                                .OrderBy(order => order.Id)
                                .ToListAsync();

            return orders;
        }

        /// <summary>
        /// 取得訂單所有明細
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Order> GetOrderDetail(int id)
        {
            var order = await _dbContext.Orders
                                .AsNoTracking()
                                .Include(order => order.User)
                                .Include(order => order.OrderDetails)
                                .Where(order => order.Id == id)
                                .OrderBy(order => order.Id)
                                .FirstOrDefaultAsync();

            return order;
        }

        /// <summary>
        /// 取得使用者所有訂單
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <returns></returns>
        public async Task<IReadOnlyCollection<Order>> GetUserOrders(int userId)
        {
            var userOrders = await _dbContext.Orders
                                .AsNoTracking()
                                .Include(order => order.OrderDetails)
                                .Where(order => order.UserId == userId)
                                .OrderByDescending(order => order.Id)
                                .ToListAsync();

            return userOrders;
        }
    }
}