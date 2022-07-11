using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CeShop.Business.ILogics;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.IConfigurations;
using CeShop.Domain.Dtos.Requests;
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
    [SwaggerTag("後台-商品類型管理")]
    public class GoodsTypesController : ControllerBase
    {
        private readonly ILogger<GoodsTypesController> _logger;
        private readonly IGoodsTypesLogic _goodsTypesLogic;

        public GoodsTypesController(ILogger<GoodsTypesController> logger, IGoodsTypesLogic goodsTypesLogic)
        {
            _logger = logger;
            _goodsTypesLogic = goodsTypesLogic;
        }

        /// <summary>
        /// 取得所有商品類型資料
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var goodsTypes = await _goodsTypesLogic.GetAllAsync();
            return Ok(goodsTypes);
        }

        /// <summary>
        /// 透過Id取得商品類型詳細資料
        /// </summary>
        /// <param name="id">商品類型Id</param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var goodsType = await _goodsTypesLogic.GetByIdAsync(id);
                return Ok(goodsType);
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

        /// <summary>
        /// 新增商品類型資料
        /// </summary>
        /// <param name="goodsTypePostRequestDto">新增商品類型物件</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> Post(GoodsTypePostRequestDto goodsTypePostRequestDto)
        {
            try
            {
                await _goodsTypesLogic.CreateAsync(goodsTypePostRequestDto);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex.ToString());
                return BadRequest();
            }
        }

        /// <summary>
        /// 透過Id刪除商品類型資料
        /// </summary>
        /// <param name="id">商品類型Id</param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _goodsTypesLogic.DeleteAsync(id);
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