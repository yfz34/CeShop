using System;
using System.Linq;
using System.Threading.Tasks;
using CeShop.Business.ILogics;
using CeShop.Data.EF.Entities;
using CeShop.Domain.Dtos.Generics;
using CeShop.Domain.Dtos.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Swashbuckle.AspNetCore.Annotations;

namespace CeShop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [SwaggerTag("前台-商品查找")]
    public class ItemsController : ControllerBase
    {
        private readonly ILogger<ItemsController> _logger;
        private readonly IItemsLogic _itemsLogic;

        public ItemsController(ILogger<ItemsController> logger, IItemsLogic itemsLogic)
        {
            _logger = logger;
            _itemsLogic = itemsLogic;
        }

        /// <summary>
        /// 商品分頁搜索
        /// </summary>
        /// <param name="page">頁碼</param>
        /// <param name="size">一頁多少筆</param>
        /// <param name="order">排序方式(desc or asc)</param>
        /// <param name="categoryId">分類ID</param>
        /// <param name="keyword">關鍵字</param>
        /// <returns></returns>
        [HttpGet("paging")]
        public async Task<ActionResult<ItemsOfPagingResponseDto>> GetItemsOfPaging(int page, int size, string order, int? categoryId, string keyword)
        {
            if (page == 0 || size == 0)
                return BadRequest("page或size不能為0");

            try
            {
                var goodsTuple = await _itemsLogic.GetGoodsListOfPagingAsync(page, size, order, categoryId, keyword);

                var result = new ItemsOfPagingResponseDto
                {
                    Page = page,
                    Size = size,
                    Results = goodsTuple.Item2.Select(g => new ItemDto
                    {
                        Id = g.Id,
                        Code = g.Code,
                        Name = g.Name,
                        Description = g.Description,
                        Unit = g.Unit,
                        OriginPrice = g.OriginPrice,
                        SellPrice = g.SellPrice,
                        Stock = g.Stock,
                        MainImage = g.MainPictureName,
                        Status = g.Status,
                    }).ToArray(),
                    TotalCount = goodsTuple.Item1,
                };

                return Ok(result);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// 透過GoodsSkuId取得貨品資料
        /// </summary>
        /// <param name="id">GoodsSkuId</param>
        /// <returns></returns>
        [HttpGet("sku/{id}")]
        public async Task<IActionResult> GetGoodsSkuById(int id)
        {
            try
            {
                var goodsSku = await _itemsLogic.GetGoodsSkuByIdAsync(id);
                return Ok(goodsSku);
            }
            catch (NullReferenceException)
            {
                return NotFound();
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// 透過GoodsId取得商品資料
        /// </summary>
        /// <param name="id">GoodsId</param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGoodsById(int id)
        {
            Goods goods = new Goods();

            try
            {
                goods = await _itemsLogic.GetGoodsById(id);
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

            var itemDetailResponseDto = new ItemDetailResponseDto
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

            return Ok(itemDetailResponseDto);
        }
    }
}