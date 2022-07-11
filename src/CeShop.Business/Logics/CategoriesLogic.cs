using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CeShop.Business.ILogics;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.IConfigurations;
using CeShop.Domain.Dtos.Requests;

namespace CeShop.Business.Logics
{
    /// <summary>
    /// 商品分類管理邏輯處理實作
    /// </summary>
    public class CategoriesLogic : ICategoriesLogic
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoriesLogic(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// 取得根節點分類列表
        /// </summary>
        /// <returns>Category List</returns>
        public async Task<IReadOnlyCollection<Category>> GetRootCategoriesAsync()
        {
            var categories = await _unitOfWork.Categories.ReadsAsync(c => c.Tier == 1);
            return categories;
        }

        /// <summary>
        /// 透過CategoryId取得分類詳細資料
        /// </summary>
        /// <param name="id">CategoryId</param>
        /// <returns>Category</returns>
        public async Task<Category> GetCategoryByIdAsync(int id)
        {
            var category = await _unitOfWork.Categories.GetDetail(id);
            return category;
        }

        /// <summary>
        /// 新增分類資料
        /// </summary>
        /// <param name="categoryPostRequestDto">新增分類物件</param>
        /// <returns>New Category</returns>
        public async Task<Category> CreateCategoryAsync(CategoryPostRequestDto categoryPostRequestDto)
        {
            var newCategory = new Category
            {
                ParentCategoryId = categoryPostRequestDto.ParentId == 0 ? null : categoryPostRequestDto.ParentId,
                Tier = categoryPostRequestDto.Level,
                Name = categoryPostRequestDto.Name,
                Sequence = 1
            };

            await _unitOfWork.Categories.CreateAsync(newCategory);
            await _unitOfWork.CompleteAsync();

            return newCategory;
        }

        /// <summary>
        /// 更新分類資料
        /// </summary>
        /// <param name="id">CategoryId</param>
        /// <param name="categoryPutRequestDto">更新分類物件</param>
        /// <returns>Category</returns>
        public async Task<Category> UpdateCategoryAsync(int id, CategoryPutRequestDto categoryPutRequestDto)
        {
            var existingCategory = await _unitOfWork.Categories.GetByIdAsync(id);

            if (existingCategory == null)
                throw new NullReferenceException();

            existingCategory.Name = categoryPutRequestDto.Name;

            var categories = _unitOfWork.Categories.UpdateByProperty(existingCategory, category => category.Name);
            await _unitOfWork.CompleteAsync();

            return existingCategory;
        }

        /// <summary>
        /// 刪除分類資料
        /// </summary>
        /// <param name="id">CategoryId</param>
        /// <returns></returns>
        public async Task DeleteCategoryAsync(int id)
        {
            var existingCategory = await _unitOfWork.Categories.GetByIdAsync(id);

            if (existingCategory == null)
                throw new NullReferenceException();

            await _unitOfWork.Categories.DeleteAsync(id);
            await _unitOfWork.CompleteAsync();
            return;
        }
    }
}