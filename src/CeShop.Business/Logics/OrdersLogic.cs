using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CeShop.Business.ILogics;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.IConfigurations;
using CeShop.Domain.Dtos.Generics;
using CeShop.Domain.Dtos.Requests;

namespace CeShop.Business.Logics
{
    /// <summary>
    /// 訂單管理邏輯處理實作
    /// </summary>
    public class OrdersLogic : IOrdersLogic
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrdersLogic(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// 取得所有訂單資料
        /// </summary>
        /// <returns></returns>
        public async Task<IReadOnlyCollection<Order>> GetAllAsync()
        {
            var orders = await _unitOfWork.Orders.GetAll();
            return orders;
        }

        /// <summary>
        /// 透過OrderId取得訂單詳細資料
        /// </summary>
        /// <param name="id">OrderId</param>
        /// <returns></returns>
        public async Task<Order> GetByIdAsync(int id)
        {
            var order = await _unitOfWork.Orders.GetOrderDetail(id);
            return order;
        }

        /// <summary>
        /// 透過OrderId刪除訂單
        /// </summary>
        /// <param name="id">OrderId</param>
        /// <returns></returns>
        public async Task DeleteByIdAsync(int id)
        {
            var existingOrder = await _unitOfWork.Orders.ReadAsync(o => o.Id == id);

            if (existingOrder == null)
                throw new NullReferenceException();

            await _unitOfWork.Orders.DeleteOrder(id);
            await _unitOfWork.CompleteAsync();
        }

        /// <summary>
        /// 取得使用者所有訂單資料
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <returns></returns>
        public async Task<IReadOnlyCollection<Order>> GetUserOrdersAsync(int userId)
        {
            var userOrders = await _unitOfWork.Orders.GetUserOrders(userId);
            return userOrders;
        }

        /// <summary>
        /// 新增使用者訂單
        /// </summary>
        /// <param name="userId">UserId</param>
        /// <param name="userOrderPostRequestDto">新增訂單物件</param>
        /// <returns></returns>
        public async Task<Result<string>> CreateUserOrder(int userId, UserOrderPostRequestDto userOrderPostRequestDto)
        {
            var result = new Result<string>();

            // 取得購物車資訊
            var userCart = await _unitOfWork.Carts.ReadAsync(cart => cart.UserId == userId);
            var userCartDetails = await _unitOfWork.CartDetails.GetUserCartByDetailsIds(userCart.Id, userOrderPostRequestDto.CartDetailIds);

            if (userCartDetails.Count == 0)
            {
                result.Errors = new List<string> { "該使用者購物車沒有商品" };
                return result;
            }

            // 檢查資料 上下架 庫存比對
            foreach (var userCartDetail in userCartDetails)
            {
                var goods = userCartDetail.Goods;
                var sku = userCartDetail.GoodsSku;

                if (goods == null || sku == null)
                {
                    result.Errors = new List<string> { "未找到商品: " + userCartDetail.Id };
                    return result;
                }

                if (goods.Status != 1 || sku.Status != 1)
                {
                    result.Errors = new List<string> { "該商品未上架: " + userCartDetail.GoodsSkuId };
                    return result;
                }

                if (goods.Stock == 0 || sku.Inventory.Quantity == 0)
                {
                    result.Errors = new List<string> { "商品缺貨: " + userCartDetail.GoodsSkuId };
                    return result;
                }

                if (userCartDetail.Quantity < 1 || userCartDetail.Quantity > sku.Inventory.Quantity)
                {
                    result.Errors = new List<string> { "商品選購數量有誤: " + userCartDetail.Id };
                    return result;
                }
            }

            // 產生訂單編號
            var orderCode = getOrderNum();

            var orderDetails = userCartDetails.Select(detail =>
            {
                var specPictures = detail.GoodsSku.GoodsSkuSpecifications.Select(skuSpec => skuSpec.GoodsSpecificationOption?.Picture?.Name).ToList();
                var skuPicture = specPictures.Find(x => !string.IsNullOrEmpty(x));
                var skuSpecs = detail.GoodsSku?.GoodsSkuSpecifications?.Select(s => s.GoodsSpecificationOption.Value).ToArray();
                var totalPrice = detail.GoodsSku.SellPrice * detail.Quantity;

                return new OrderDetail
                {
                    GoodsId = detail.GoodsId,
                    GoodsSkuId = detail.GoodsSkuId,
                    ProductName = detail.Goods.Name,
                    SpecsName = string.Join(", ", skuSpecs),
                    SellPrice = detail.GoodsSku.SellPrice,
                    TotalPrice = totalPrice,
                    Quantity = detail.Quantity,
                    Picture = string.IsNullOrEmpty(skuPicture) ? detail.Goods.MainPictureName : skuPicture,
                    Status = 1,
                    CreateTime = DateTime.UtcNow,
                    UpdateTime = DateTime.UtcNow,
                };
            }).ToList();

            var newOrder = new Order
            {
                UserId = userId,
                Code = orderCode,
                TotalPrice = orderDetails.Select(detail => detail.TotalPrice).Sum(),
                TotalProduct = userCartDetails.Count,
                Status = 1,
                OrderStatus = "處理中",
                OrderDetails = orderDetails,
                CreateTime = DateTime.UtcNow,
                UpdateTime = DateTime.UtcNow,
            };

            if (userOrderPostRequestDto.TotalPrice != newOrder.TotalPrice)
            {
                result.Errors = new List<string> { "價錢有誤" };
                return result;
            }

            // 寫入Order表
            await _unitOfWork.Orders.CreateAsync(newOrder);

            // 更新 CartDetail Goods GoodsSku 庫存
            foreach (var userCartDetail in userCartDetails)
            {
                userCartDetail.Status = 0;
                _unitOfWork.CartDetails.UpdateByProperty(userCartDetail, d => d.Status);

                userCartDetail.Goods.Stock = userCartDetail.Goods.Stock - userCartDetail.Quantity;
                _unitOfWork.Goods.UpdateByProperty(userCartDetail.Goods, g => g.Stock);

                userCartDetail.GoodsSku.Inventory.Quantity = userCartDetail.GoodsSku.Inventory.Quantity - userCartDetail.Quantity;
                _unitOfWork.Inventories.UpdateByProperty(userCartDetail.GoodsSku.Inventory, i => i.Quantity);
            }

            await _unitOfWork.CompleteAsync();

            result.Data = orderCode;
            return result;
        }

        /// <summary>
        /// 產生訂單編號
        /// </summary>
        /// <returns>訂單編號字串</returns>
        private string getOrderNum()
        {
            // 取得日期
            string Dates = DateTime.Now.ToString("yyyyMMdd");

            // 隨機數
            Random Rdm = new Random(Guid.NewGuid().GetHashCode());

            // 時間戳
            TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            string newts = Convert.ToInt64(ts.TotalMilliseconds).ToString();

            string new_orderNum = "CE" + Dates + Rdm.Next(0, 100000000) + newts;
            return new_orderNum;
        }
    }
}