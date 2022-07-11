using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CeShop.Business.ILogics;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.IConfigurations;
using CeShop.Domain.Dtos.Requests;

namespace CeShop.Business.Logics
{
    /// <summary>
    /// 使用者購物車邏輯處理實作
    /// </summary>
    public class CartsLogic : ICartsLogic
    {
        private readonly IUnitOfWork _unitOfWork;

        public CartsLogic(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// 增加或更新使用者購物車資料邏輯處理
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <param name="cartPostRequestDto">新增物件</param>
        /// <returns>CartDetail</returns>
        public async Task<CartDetail> AddUserCartAsync(int userId, CartPostRequestDto cartPostRequestDto)
        {
            // 取得相關資料
            var cart = await _unitOfWork.Carts.GetSkuInUserCart(userId, cartPostRequestDto.SkuId);
            var sku = await _unitOfWork.GoodsSkus.GetDetail(cartPostRequestDto.SkuId);

            if (sku == null)
                throw new NullReferenceException("user cart not Found");

            if (cart.CartDetails.Count == 0)
            {
                // 新增至購物車

                // SKU庫存比對
                if (sku.Inventory.Quantity < cartPostRequestDto.Quantity)
                {
                    throw new OverflowException("庫存不足");
                }

                // 新增
                var cartDetail = new CartDetail
                {
                    CartId = cart.Id,
                    GoodsId = cartPostRequestDto.GoodsId,
                    GoodsSkuId = cartPostRequestDto.SkuId,
                    Quantity = cartPostRequestDto.Quantity,
                    Status = 1,
                    CreateTime = DateTime.UtcNow,
                    UpdateTime = DateTime.UtcNow
                };

                await _unitOfWork.CartDetails.CreateAsync(cartDetail);
                await _unitOfWork.CompleteAsync();
                return cartDetail;
            }

            // 更新購物車物品
            var detailSku = cart.CartDetails.ToList()[0];
            int newQuantity = cartPostRequestDto.Quantity + detailSku.Quantity;

            // SKU庫存比對
            if (sku.Inventory.Quantity < newQuantity)
            {
                throw new OverflowException("庫存不足");
            }

            // 更新
            detailSku.Quantity = newQuantity;
            _unitOfWork.CartDetails.UpdateByProperty(detailSku, x => x.Quantity);
            await _unitOfWork.CompleteAsync();
            return detailSku;
        }

        /// <summary>
        /// 刪除使用者購物車資料邏輯處理
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <param name="detailId">Cart Detail Id</param>
        /// <returns></returns>
        public async Task DeleteUserCartDetail(int userId, int detailId)
        {
            // 取得相關資料
            var cart = await _unitOfWork.Carts.ReadAsync(c => c.UserId == userId);
            var detailSku = await _unitOfWork.CartDetails.ReadAsync(d => d.CartId == cart.Id && d.Status == 1 && d.Id == detailId);

            if (detailSku == null)
                throw new NullReferenceException("not found product in cart");

            _unitOfWork.CartDetails.UpdateByProperty(new CartDetail { Id = detailId, Status = 0 }, d => d.Status);
            await _unitOfWork.CompleteAsync();
        }

        /// <summary>
        /// 取得使用者購物車所有資料邏輯處理
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <returns>CartDetail List</returns>
        public async Task<List<CartDetail>> GetUserCartAsync(int userId)
        {
            var userCart = await _unitOfWork.Carts.GetUserCartDetails(userId);

            if (userCart == null)
                throw new NullReferenceException("user cart not Found");

            var carts = userCart.CartDetails.OrderByDescending(detail => detail.Id).ToList();

            return carts;
        }

        /// <summary>
        /// 取得使用者購物車簡易資料邏輯處理
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <returns>CartDetail List</returns>
        public async Task<List<CartDetail>> GetUserMiniCartAsync(int userId)
        {
            var userCart = await _unitOfWork.Carts.GetUserMiniCart(userId);

            if (userCart == null)
                throw new NullReferenceException("user cart not Found");

            var miniCart = userCart.CartDetails.OrderByDescending(detail => detail.Id).ToList();

            return miniCart;
        }

        /// <summary>
        /// 取得使用者購物車資料筆數邏輯處理
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <returns>資料筆數</returns>
        public async Task<int> GetUserCartDetailCountAsync(int userId)
        {
            var cart = await _unitOfWork.Carts.ReadAsync(c => c.UserId == userId);
            var totalCount = await _unitOfWork.CartDetails.GetCountAsync(d => d.CartId == cart.Id && d.Status == 1);
            return totalCount;
        }

        /// <summary>
        /// 更新使用者購物車資料邏輯處理
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <param name="cartPutRequestDto">更新物件</param>
        /// <returns>CartDetail</returns>
        public async Task<CartDetail> UpdateUserChartDetailAsync(int userId, CartPutRequestDto cartPutRequestDto)
        {
            // 取得相關資料
            var cart = await _unitOfWork.Carts.GetUserCartDetail(userId, cartPutRequestDto.CartDetailId);

            if (cart.CartDetails.Count() == 0)
                throw new NullReferenceException("user cart not Found");

            var detail = cart.CartDetails.ToList()[0];
            var sku = await _unitOfWork.GoodsSkus.GetDetail(detail.GoodsSkuId);

            if (sku == null)
                throw new NullReferenceException("user cart not Found");

            // SKU庫存比對
            if (sku.Inventory.Quantity < cartPutRequestDto.Quantity)
            {
                cartPutRequestDto.Quantity = sku.Inventory.Quantity;
            }

            // 更新
            detail.Quantity = cartPutRequestDto.Quantity == 0 ? 1 : cartPutRequestDto.Quantity;
            _unitOfWork.CartDetails.UpdateByProperty(detail, x => x.Quantity);
            await _unitOfWork.CompleteAsync();
            return detail;
        }
    }
}