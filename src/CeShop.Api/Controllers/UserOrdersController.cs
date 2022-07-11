using System;
using System.Threading.Tasks;
using CeShop.Business.ILogics;
using CeShop.Data.EF.Entities;
using CeShop.Domain.Dtos.Requests;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Swashbuckle.AspNetCore.Annotations;

namespace CeShop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Authorize(Roles = "Customer")]
    [SwaggerTag("前台-使用者訂單管理")]
    public class UserOrdersController : ControllerBase
    {
        private readonly ILogger<OrdersController> _logger;
        private readonly IOrdersLogic _ordersLogic;
        private readonly UserManager<AppUser> _userManager;

        public UserOrdersController(ILogger<OrdersController> logger, IOrdersLogic ordersLogic, UserManager<AppUser> userManager)
        {
            _logger = logger;
            _ordersLogic = ordersLogic;
            _userManager = userManager;
        }

        /// <summary>
        /// 取得使用者所有訂單資料
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetUserOrders()
        {
            var loggedInUser = await _userManager.GetUserAsync(HttpContext.User);

            if (loggedInUser == null)
                return BadRequest("User not Found");

            var userOrders = await _ordersLogic.GetUserOrdersAsync(loggedInUser.Id);

            return Ok(userOrders);
        }

        /// <summary>
        /// 新增使用者訂單
        /// </summary>
        /// <param name="userOrderPostRequestDto">新增訂單物件</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> CreateUserOrder(UserOrderPostRequestDto userOrderPostRequestDto)
        {
            var loggedInUser = await _userManager.GetUserAsync(HttpContext.User);

            if (loggedInUser == null)
                return BadRequest("User not Found");

            try
            {
                var result = await _ordersLogic.CreateUserOrder(loggedInUser.Id, userOrderPostRequestDto);
                if (!result.Success)
                    return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex.ToString());
                return BadRequest();
            }
        }
    }
}