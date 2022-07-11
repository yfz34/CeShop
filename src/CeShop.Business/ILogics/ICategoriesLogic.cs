using System.Collections.Generic;
using System.Threading.Tasks;
using CeShop.Data.EF.Entities;
using CeShop.Domain.Dtos.Requests;

namespace CeShop.Business.ILogics
{
    /// <summary>
    /// 商品分類管理邏輯處理介面
    /// </summary>
    public interface ICategoriesLogic
    {
        /// <summary>
        /// 取得根節點分類列表
        /// </summary>
        /// <returns>Category List</returns>
        public Task<IReadOnlyCollection<Category>> GetRootCategoriesAsync();

        /// <summary>
        /// 透過CategoryId取得分類詳細資料
        /// </summary>
        /// <param name="id">CategoryId</param>
        /// <returns>Category</returns>
        public Task<Category> GetCategoryByIdAsync(int id);

        /// <summary>
        /// 新增分類資料
        /// </summary>
        /// <param name="categoryPostRequestDto">新增分類物件</param>
        /// <returns>New Category</returns>
        public Task<Category> CreateCategoryAsync(CategoryPostRequestDto categoryPostRequestDto);

        /// <summary>
        /// 更新分類資料
        /// </summary>
        /// <param name="id">CategoryId</param>
        /// <param name="categoryPutRequestDto">更新分類物件</param>
        /// <returns>Category</returns>
        public Task<Category> UpdateCategoryAsync(int id, CategoryPutRequestDto categoryPutRequestDto);

        /// <summary>
        /// 刪除分類資料
        /// </summary>
        /// <param name="id">CategoryId</param>
        /// <returns></returns>
        public Task DeleteCategoryAsync(int id);
    }
}