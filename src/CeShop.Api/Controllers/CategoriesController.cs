using System;
using System.Linq;
using System.Threading.Tasks;
using CeShop.Business.ILogics;
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
    [SwaggerTag("後台-商品分類管理")]
    public class CategoriesController : ControllerBase
    {
        private readonly ILogger<CategoriesController> _logger;
        private readonly ICategoriesLogic _categoriesLogic;

        public CategoriesController(ILogger<CategoriesController> logger, ICategoriesLogic categoriesLogic)
        {
            _logger = logger;
            _categoriesLogic = categoriesLogic;
        }

        /// <summary>
        /// 取得根節點分類列表
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Get(int? level)
        {
            var categories = await _categoriesLogic.GetRootCategoriesAsync();

            var categoriesResponseDto = categories.Select(category => new CategoriesResponseDto
            {
                Id = category.Id,
                ParentId = category.ParentCategoryId ?? default(int),
                Name = category.Name,
                Level = category.Tier
            });

            return Ok(categoriesResponseDto);
        }

        /// <summary>
        /// 透過CategoryId取得分類詳細資料
        /// </summary>
        /// <param name="id">CategoryId</param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _categoriesLogic.GetCategoryByIdAsync(id);

            if (category == null)
                return NotFound();

            var categoriesResponseDto = new CategoriesResponseDto
            {
                Id = category.Id,
                ParentId = category.ParentCategoryId ?? default(int),
                Level = category.Tier,
                Name = category.Name,

                Children = category.SubCategorys.Select(sub => new CategoriesResponseDto
                {
                    Id = sub.Id,
                    ParentId = sub.ParentCategoryId ?? default(int),
                    Level = sub.Tier,
                    Name = sub.Name,
                }).ToArray()
            };

            return Ok(categoriesResponseDto);
        }

        /// <summary>
        /// 新增分類資料
        /// </summary>
        /// <param name="categoryPostRequestDto">新增分類物件</param>
        [HttpPost]
        public async Task<IActionResult> Post(CategoryPostRequestDto categoryPostRequestDto)
        {
            var newCategory = await _categoriesLogic.CreateCategoryAsync(categoryPostRequestDto);

            var categoriesResponseDto = new CategoriesResponseDto
            {
                Id = newCategory.Id,
                ParentId = newCategory.ParentCategoryId ?? default(int),
                Name = newCategory.Name,
                Level = newCategory.Tier
            };

            return CreatedAtAction(nameof(GetById), new { id = categoriesResponseDto.Id }, categoriesResponseDto);
        }

        /// <summary>
        /// 更新分類資料
        /// </summary>
        /// <param name="id">Cart Id</param>
        /// <param name="categoryPutRequestDto">更新分類物件</param>
        /// <returns></returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, CategoryPutRequestDto categoryPutRequestDto)
        {
            try
            {
                await _categoriesLogic.UpdateCategoryAsync(id, categoryPutRequestDto);
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

        /// <summary>
        /// 刪除分類資料
        /// </summary>
        /// <param name="id">Id</param>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _categoriesLogic.DeleteCategoryAsync(id);
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