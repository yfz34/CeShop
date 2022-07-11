using System.Collections.Generic;
using System.Threading.Tasks;
using CeShop.Data.EF.Entities;

namespace CeShop.Data.Service.IRepositories
{
    public interface ICartDetailsRepository : IBaseRepository<CartDetail>
    {
        /// <summary>
        /// 指定取得使用者購物車明細
        /// </summary>
        /// <param name="cartId">購物車ID</param>
        /// <param name="CartDetailIds">CartDetailId List</param>
        /// <returns></returns>
        public Task<List<CartDetail>> GetUserCartByDetailsIds(int cartId, List<int> CartDetailIds);
    }
}