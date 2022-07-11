using System;
using System.Linq;
using System.Threading.Tasks;
using CeShop.Business.ILogics;
using CeShop.Data.Service.IConfigurations;
using CeShop.Domain.Dtos.Responses;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Swashbuckle.AspNetCore.Annotations;

namespace CeShop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Authorize(Roles = "Admin")]
    [SwaggerTag("後台-訂單管理")]
    public class OrdersController : ControllerBase
    {
        private readonly ILogger<OrdersController> _logger;
        private readonly IOrdersLogic _ordersLogic;

        public OrdersController(ILogger<OrdersController> logger, IOrdersLogic ordersLogic)
        {
            _logger = logger;
            _ordersLogic = ordersLogic;
        }

        /// <summary>
        /// 取得所有訂單資料
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _ordersLogic.GetAllAsync();

            var orderResponseDto = orders.Select(order => new OrderResponseDto
            {
                Id = order.Id,
                Account = order.User.UserName,
                Code = order.Code,
                TotalPrice = order.TotalPrice,
                TotalProduct = order.TotalProduct,
                Status = order.Status,
                OrderStatus = order.OrderStatus,
                CreateTime = order.CreateTime,
            }).ToList();

            return Ok(orderResponseDto);
        }

        /// <summary>
        /// 透過OrderId取得訂單詳細資料
        /// </summary>
        /// <param name="id">OrderId</param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _ordersLogic.GetByIdAsync(id);

            if (order == null)
                return NotFound();

            var orderDetailResponseDto = new OrderDetailResponseDto
            {
                Id = order.Id,
                Account = order.User.UserName,
                Code = order.Code,
                TotalPrice = order.TotalPrice,
                TotalProduct = order.TotalProduct,
                Status = order.Status,
                OrderStatus = order.OrderStatus,
                CreateTime = order.CreateTime,
                Details = order.OrderDetails.Select(detail => new OrderDetailResponseDtoDetail
                {
                    Id = detail.Id,
                    GoodsId = detail.GoodsId,
                    GoodsSkuId = detail.GoodsSkuId,
                    ProductName = detail.ProductName,
                    SpecsName = detail.SpecsName,
                    SellPrice = detail.SellPrice,
                    TotalPrice = detail.TotalPrice,
                    Quantity = detail.Quantity,
                    Picture = detail.Picture,
                    Status = detail.Status,
                }).ToList()
            };

            return Ok(orderDetailResponseDto);
        }

        /// <summary>
        /// 透過OrderId刪除訂單
        /// </summary>
        /// <param name="id">OrderId</param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                await _ordersLogic.DeleteByIdAsync(id);
                return NoContent();
            }
            catch (NullReferenceException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex.ToString());
                return BadRequest();
            }
        }
    }
}