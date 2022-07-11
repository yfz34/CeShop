using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CeShop.Business.ILogics;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.IConfigurations;
using CeShop.Domain.Dtos.Generics;
using CeShop.Domain.Dtos.Requests;
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
    [SwaggerTag("後台-商品管理")]
    public class GoodsController : ControllerBase
    {
        private readonly ILogger<GoodsController> _logger;
        private readonly IGoodsLogic _goodsLogic;

        public GoodsController(ILogger<GoodsController> logger, IGoodsLogic goodsLogic)
        {
            _logger = logger;
            _goodsLogic = goodsLogic;
        }

        /// <summary>
        /// 取得所有商品資料
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var goods = await _goodsLogic.GetAllAsync();
            return Ok(goods);
        }

        /// <summary>
        /// 透過GoodsId取的商品詳細資料
        /// </summary>
        /// <param name="id">GoodsId</param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var goods = await _goodsLogic.GetByIdAsync(id);

                var goodsDetailResponseDto = new GoodsDetailResponseDto
                {
                    Id = goods.Id,
                    Code = goods.Code,
                    Name = goods.Name,
                    Description = goods.Description,
                    Unit = goods.Unit,
                    Price = goods.SellPrice,
                    Stock = goods.Stock,
                    MainImage = goods.MainPictureName,
                    Status = goods.Status,

                    Categories = goods.CategoryGoodsList.Select(categoryGoods => new CategoryDto
                    {
                        Id = categoryGoods.CategoryId,
                        Name = categoryGoods.Category.Name,
                        Tier = categoryGoods.Category.Tier
                    }).ToList(),

                    Images = goods.GoodsPictures.Select(goodsPicture => goodsPicture.Picture.Name).ToList(),

                    Attributes = goods.GoodsAttributes.Select(goodsAttribute => new AttributeDto
                    {
                        Id = goodsAttribute.Id,
                        Name = goodsAttribute.Name,
                        Value = goodsAttribute.Value
                    }).ToList(),

                    Specifications = goods.GoodsSpecifications.Select(goodsSpecification => new SpecificationDto
                    {
                        Id = goodsSpecification.Id,
                        Name = goodsSpecification.Name,
                        SpecificationOption = goodsSpecification.GoodsSpecificationOptions.Select(option => new SpecificationOptionDto
                        {
                            Id = option.Id,
                            Name = option.Value,
                            Image = option?.Picture?.Name
                        }).ToList()
                    }).ToList(),

                    GoodsSkus = goods.GoodsSkus.Select(goodsSku => new GoodsSkuDto
                    {
                        Id = goodsSku.Id,
                        Name = goodsSku.Name,
                        SkuCode = goodsSku.SkuCode,
                        Price = goodsSku.SellPrice,
                        Quantity = goodsSku.Inventory.Quantity,
                        Status = goodsSku.Status,

                        SkuSpecifications = goodsSku.GoodsSkuSpecifications.OrderBy(skuSpec => skuSpec.GoodsSpecification.Sequence).Select(goodsSkuSpecification => new SkuSpecificationDto
                        {
                            SpecId = goodsSkuSpecification.GoodsSpecification.Id,
                            SpecName = goodsSkuSpecification.GoodsSpecification.Name,
                            SpecOptionId = goodsSkuSpecification.GoodsSpecificationOption.Id,
                            SpecOptionName = goodsSkuSpecification.GoodsSpecificationOption.Value
                        }).ToList()
                    }).ToList()
                };

                return Ok(goodsDetailResponseDto);
            }
            catch (NullReferenceException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex.ToString());
                return BadRequest(ex.GetType().ToString());
            }
        }

        /// <summary>
        /// 新增商品資料
        /// </summary>
        /// <param name="goodsPostRequestDto">新增商品物件</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> Post(GoodsPostRequestDto goodsPostRequestDto)
        {
            try
            {
                await _goodsLogic.CreateAsync(goodsPostRequestDto);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex.ToString());
                return BadRequest();
            }
        }

        /// <summary>
        /// 更新商品上下架
        /// </summary>
        /// <param name="id">GoodsId</param>
        /// <param name="isShelf">是否上架</param>
        /// <returns></returns>
        [HttpPut("status/{id}")]
        public async Task<IActionResult> UpdateGoodsStatus(int id, bool isShelf)
        {
            try
            {
                await _goodsLogic.UpdateStatusAsync(id, isShelf);
                return NoContent();
            }
            catch (NullReferenceException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex.ToString());
                return BadRequest(ex.GetType().ToString());
            }
        }

        /// <summary>
        /// 透過GoodsId刪除資料
        /// </summary>
        /// <param name="id">GoodsId</param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGoods(int id)
        {
            try
            {
                await _goodsLogic.DeleteAsync(id);
                return NoContent();
            }
            catch (NullReferenceException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex.ToString());
                return BadRequest(ex.GetType().ToString());
            }
        }
    }
}