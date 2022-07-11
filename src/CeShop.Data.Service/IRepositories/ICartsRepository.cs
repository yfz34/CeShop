using System.Collections.Generic;
using System.Threading.Tasks;
using CeShop.Data.EF.Entities;

namespace CeShop.Data.Service.IRepositories
{
    public interface ICartsRepository : IBaseRepository<Cart>
    {
        /// <summary>
        /// 取得使用者購物車簡易資料
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <returns>Cart</returns>
        public Task<Cart> GetUserMiniCart(int userId);

        /// <summary>
        /// 取得使用者購物車所有資料
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <returns>Cart</returns>
        public Task<Cart> GetUserCartDetails(int userId);

        /// <summary>
        /// 取得使用者購物車單筆明細資料
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <param name="detailId">CartDetailId</param>
        /// <returns></returns>
        public Task<Cart> GetUserCartDetail(int userId, int detailId);

        /// <summary>
        /// 取得使用者購物車單筆明細資料
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <param name="detailId">CartDetailId</param>
        /// <returns></returns>
        public Task<Cart> GetSkuInUserCart(int userId, int skuId);
    }
}