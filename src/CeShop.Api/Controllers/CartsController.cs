using System;
using System.Linq;
using System.Threading.Tasks;
using CeShop.Business.ILogics;
using CeShop.Data.EF.Entities;
using CeShop.Domain.Dtos.Requests;
using CeShop.Domain.Dtos.Responses;
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
    [SwaggerTag("前台-使用者購物車管理")]
    public class CartsController : ControllerBase
    {
        private readonly ILogger<CartsController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly ICartsLogic _cartsLogic;

        public CartsController(ILogger<CartsController> logger, UserManager<AppUser> userManager, ICartsLogic cartsLogic)
        {
            _logger = logger;
            _userManager = userManager;
            _cartsLogic = cartsLogic;
        }

        /// <summary>
        /// 取得使用者購物車簡易資料
        /// </summary>
        [HttpGet("mini")]
        public async Task<IActionResult> GetUserMiniCart()
        {
            var loggedInUser = await _userManager.GetUserAsync(HttpContext.User);

            if (loggedInUser == null)
                return BadRequest("User not Found");

            try
            {
                var miniCart = await _cartsLogic.GetUserMiniCartAsync(loggedInUser.Id);
                var userMiniCartReponseDto = new UserMiniCartReponseDto
                {
                    TotalCount = await _cartsLogic.GetUserCartDetailCountAsync(loggedInUser.Id),
                    Carts = miniCart.Select(detail =>
                    {
                        var specPictures = detail.GoodsSku.GoodsSkuSpecifications.Select(skuSpec => skuSpec.GoodsSpecificationOption?.Picture?.Name).ToList();
                        var skuPicture = specPictures.Find(x => !string.IsNullOrEmpty(x));

                        return new UserMiniCart
                        {
                            GoodsId = detail.GoodsId,
                            GoodsSkuId = detail.GoodsSkuId,
                            Name = detail.Goods.Name,
                            Picture = string.IsNullOrEmpty(skuPicture) ? detail.Goods.MainPictureName : skuPicture,
                            Price = detail.GoodsSku.SellPrice
                        };
                    }).ToList()
                };
                return Ok(userMiniCartReponseDto);
            }
            catch (NullReferenceException nullReferenceException)
            {
                return NotFound(nullReferenceException.ToString());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.GetType().ToString());
            }
        }

        /// <summary>
        /// 取得使用者購物車所有資料
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetUserCart()
        {
            var loggedInUser = await _userManager.GetUserAsync(HttpContext.User);

            if (loggedInUser == null)
                return BadRequest("User not Found");

            try
            {
                var carts = await _cartsLogic.GetUserCartAsync(loggedInUser.Id);
                var userCartReponseDto = carts.Select(detail =>
                {
                    var specPictures = detail.GoodsSku.GoodsSkuSpecifications.Select(skuSpec => skuSpec.GoodsSpecificationOption?.Picture?.Name).ToList();
                    var skuPicture = specPictures.Find(x => !string.IsNullOrEmpty(x));
                    var skuSpecs = detail.GoodsSku?.GoodsSkuSpecifications?.Select(s => s.GoodsSpecificationOption.Value).ToArray();

                    return new UserCartReponseDto
                    {
                        CartDetailId = detail.Id,
                        GoodsId = detail.GoodsId,
                        GoodsSkuId = detail.GoodsSkuId,
                        Name = detail.Goods.Name,
                        Picture = string.IsNullOrEmpty(skuPicture) ? detail.Goods.MainPictureName : skuPicture,
                        Price = detail.GoodsSku.SellPrice,
                        SkuQuantity = detail.GoodsSku.Inventory.Quantity,
                        SkuSpecs = string.Join(", ", skuSpecs),
                        Quantity = detail.Quantity,
                        GoodsStatus = detail.Goods.Status,
                    };
                }).ToList();

                return Ok(userCartReponseDto);
            }
            catch (NullReferenceException nullReferenceException)
            {
                return NotFound(nullReferenceException.ToString());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.GetType().ToString());
            }
        }

        /// <summary>
        /// 增加或更新使用者購物車資料
        /// </summary>
        /// <param name="cartPostRequestDto">新增物件</param>
        [HttpPost]
        public async Task<IActionResult> AddUserCart(CartPostRequestDto cartPostRequestDto)
        {
            var loggedInUser = await _userManager.GetUserAsync(HttpContext.User);

            if (loggedInUser == null)
                return BadRequest("User not Found");

            try
            {
                var cartDetail = await _cartsLogic.AddUserCartAsync(loggedInUser.Id, cartPostRequestDto);
                return Ok(cartDetail);
            }
            catch (NullReferenceException nullReferenceException)
            {
                return NotFound(nullReferenceException.ToString());
            }
            catch (OverflowException)
            {
                return BadRequest("庫存不足");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex.ToString());
                return BadRequest();
            }
        }

        /// <summary>
        /// 更新使用者購物車資料
        /// </summary>
        /// <param name="cartPutRequestDto">更新物件</param>
        [HttpPut]
        public async Task<IActionResult> UpdateUserChartDetail(CartPutRequestDto cartPutRequestDto)
        {
            var loggedInUser = await _userManager.GetUserAsync(HttpContext.User);

            if (loggedInUser == null)
                return BadRequest("User not Found");

            try
            {
                var cartDetail = await _cartsLogic.UpdateUserChartDetailAsync(loggedInUser.Id, cartPutRequestDto);
                return Ok(cartDetail);
            }
            catch (NullReferenceException nullReferenceException)
            {
                return NotFound(nullReferenceException.ToString());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        /// <summary>
        /// 刪除使用者購物車資料
        /// </summary>
        /// <param name="id">Cart Detail Id</param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserCartDetail(int id)
        {
            var loggedInUser = await _userManager.GetUserAsync(HttpContext.User);

            if (loggedInUser == null)
                return BadRequest("User not Found");

            try
            {
                await _cartsLogic.DeleteUserCartDetail(loggedInUser.Id, id);
                return Ok();
            }
            catch (NullReferenceException nullReferenceException)
            {
                return NotFound(nullReferenceException.ToString());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }
    }
}