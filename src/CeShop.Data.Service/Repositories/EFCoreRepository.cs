using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using CeShop.Data.EF.Contexts;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.IRepositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CeShop.Data.Service.Repositories
{
    public class EFCoreRepository<T> : IBaseRepository<T> where T : BaseEntity
    {
        protected CeShopDbContext _dbContext;
        internal DbSet<T> dbSet;
        protected readonly ILogger _logger;

        public EFCoreRepository(
            CeShopDbContext dbContext,
            ILogger logger
        )
        {
            _dbContext = dbContext;
            dbSet = _dbContext.Set<T>();
            _logger = logger;
        }

        /// <summary>
        /// 讀取所有資料
        /// </summary>
        /// <returns>列舉資料</returns>
        public async Task<IReadOnlyCollection<T>> ReadsAsync()
        {
            return await dbSet.AsNoTracking().ToListAsync();
        }

        /// <summary>
        /// 讀取符合條件內資料
        /// </summary>
        /// <param name="filter">條件式</param>
        /// <returns>列舉資料</returns>
        public async Task<IReadOnlyCollection<T>> ReadsAsync(Expression<Func<T, bool>> filter)
        {
            return await dbSet.Where(filter).AsNoTracking().ToListAsync();
        }

        /// <summary>
        /// 讀取第一筆符合條件的資料
        /// </summary>
        /// <param name="filter">條件式</param>
        /// <returns>資料物件</returns>
        public async Task<T> ReadAsync(Expression<Func<T, bool>> filter)
        {
            return await dbSet.AsNoTracking().FirstOrDefaultAsync(filter);
        }

        /// <summary>
        /// 取得Id資料
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns>資料物件</returns>
        public async Task<T> GetByIdAsync(int id)
        {
            return await dbSet.FindAsync(id);
        }

        /// <summary>
        /// 新增一筆資料
        /// </summary>
        /// <param name="entity">資料物件</param>
        /// <returns>boolean</returns>
        public async Task<bool> CreateAsync(T entity)
        {
            try
            {
                entity.CreateTime = DateTime.UtcNow;
                entity.UpdateTime = DateTime.UtcNow;

                await dbSet.AddAsync(entity);
                return true;
            }
            catch (System.Exception ex)
            {
                _logger.LogWarning(ex.ToString());
                return false;
            }
        }

        /// <summary>
        /// 更新一筆資料
        /// </summary>
        /// <param name="entity">資料物件</param>
        /// <returns></returns>
        public bool Update(T entity)
        {
            if (entity.Id == 0)
                return false;

            entity.UpdateTime = DateTime.UtcNow;

            _dbContext.Entry<T>(entity).State = EntityState.Modified;

            return true;
        }

        /// <summary>
        /// 更新指定欄位資料
        /// </summary>
        /// <param name="id">Id</param>
        /// <param name="entity">資料物件</param>
        /// <returns>boolean</returns>
        public bool UpdateByProperty(T entity, params Expression<Func<T, object>>[] properties)
        {
            _dbContext.Attach(entity);

            if (properties != null)
            {
                foreach (var property in properties)
                {
                    _dbContext.Entry<T>(entity).Property(property).IsModified = true;
                }
            }

            entity.UpdateTime = DateTime.UtcNow;
            _dbContext.Entry<T>(entity).Property(p => p.UpdateTime).IsModified = true;

            return true;
        }

        /// <summary>
        /// 刪除一筆資料
        /// </summary>
        /// <returns>boolean</returns>
        public async Task<bool> DeleteAsync(int id)
        {
            var data = await dbSet.FindAsync(id);

            if (data == null)
            {
                return false;
            }

            dbSet.Remove(data);

            return true;
        }

        /// <summary>
        /// 取得資料筆數
        /// </summary>
        /// <returns>資料筆數</returns>
        public async Task<int> GetCountAsync()
        {
            return await dbSet.CountAsync();
        }

        /// <summary>
        /// 取得符合條件內資料筆數
        /// </summary>
        /// <param name="filter">條件式</param>
        /// <returns>資料筆數</returns>
        public async Task<int> GetCountAsync(Expression<Func<T, bool>> filter)
        {
            return await dbSet.CountAsync(filter);
        }
    }
}