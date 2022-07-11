using System.Collections.Generic;
using System.Threading.Tasks;
using CeShop.Data.EF.Entities;
using CeShop.Domain.Dtos.Requests;
using Microsoft.AspNetCore.Identity;

namespace CeShop.Business.ILogics
{
    /// <summary>
    /// 使用者管理邏輯處理介面
    /// </summary>
    public interface IUsersLogic
    {
        /// <summary>
        /// 取得所有使用者資料
        /// </summary>
        /// <returns></returns>
        public Task<List<AppUser>> GetAllUsersAsync();

        /// <summary>
        /// 取得顧客資料
        /// </summary>
        /// <param name="id">UserId</param>
        /// <returns></returns>
        public Task<UserProfile> GetUserInfoAsync(int userId);

        /// <summary>
        /// 更新顧客資料
        /// </summary>
        /// <param name="id">UserId</param>
        /// <param name="userProfilePutRequestDto">更新物件</param>
        /// <returns></returns>
        public Task UpdateUserInfoAsync(int userId, UserProfilePutRequestDto userProfilePutRequestDto);

        /// <summary>
        /// 透過UserId刪除使用者
        /// </summary>
        /// <param name="id">UserId</param>
        /// <returns></returns>
        public Task<IdentityResult> DeleteUserAsync(int id);
    }
}