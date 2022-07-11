using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using CeShop.Data.EF.Entities;

namespace CeShop.Data.Service.IRepositories
{
    public interface IBaseRepository<T> where T : BaseEntity
    {
        /// <summary>
        /// 取得資料筆數
        /// </summary>
        /// <returns>資料筆數</returns>
        Task<int> GetCountAsync();

        /// <summary>
        /// 取得符合條件內資料筆數
        /// </summary>
        /// <param name="filter">條件式</param>
        /// <returns>資料筆數</returns>
        Task<int> GetCountAsync(Expression<Func<T, bool>> filter);

        /// <summary>
        /// 讀取所有資料
        /// </summary>
        /// <returns>列舉資料</returns>
        Task<IReadOnlyCollection<T>> ReadsAsync();

        /// <summary>
        /// 讀取符合條件內資料
        /// </summary>
        /// <param name="filter">條件式</param>
        /// <returns>列舉資料</returns>
        Task<IReadOnlyCollection<T>> ReadsAsync(Expression<Func<T, bool>> filter);

        /// <summary>
        /// 讀取第一筆符合條件的資料
        /// </summary>
        /// <param name="filter">條件式</param>
        /// <returns>資料物件</returns>
        Task<T> ReadAsync(Expression<Func<T, bool>> filter);

        /// <summary>
        /// 取得Id資料
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns>資料物件</returns>
        Task<T> GetByIdAsync(int id);

        /// <summary>
        /// 新增一筆資料
        /// </summary>
        /// <param name="entity">資料物件</param>
        /// <returns>boolean</returns>
        Task<bool> CreateAsync(T entity);

        /// <summary>
        /// 更新一筆資料
        /// </summary>
        /// <param name="entity">資料物件</param>
        /// <returns></returns>
        bool Update(T entity);

        /// <summary>
        /// 更新指定欄位資料
        /// </summary>
        /// <param name="id">Id</param>
        /// <param name="entity">資料物件</param>
        /// <returns>boolean</returns>
        bool UpdateByProperty(T entity, params Expression<Func<T, object>>[] properties);

        /// <summary>
        /// 刪除一筆資料
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns></returns>
        Task<bool> DeleteAsync(int id);
    }
}