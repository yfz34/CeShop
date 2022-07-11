using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CeShop.Business.ILogics;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.IConfigurations;
using CeShop.Domain.Dtos.Requests;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CeShop.Business.Logics
{
    /// <summary>
    /// 使用者管理邏輯處理實作
    /// </summary>
    public class UsersLogic : IUsersLogic
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<AppUser> _userManager;

        public UsersLogic(IUnitOfWork unitOfWork, UserManager<AppUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        /// <summary>
        /// 取得所有使用者資料
        /// </summary>
        /// <returns></returns>
        public async Task<List<AppUser>> GetAllUsersAsync()
        {
            var users = await _userManager.Users
                                .Include(user => user.UserProfile)
                                .Include(user => user.UserRoles)
                                .ThenInclude(userRole => userRole.Role)
                                .Where(user => user.Id > 1)
                                .AsNoTracking()
                                .ToListAsync();
            return users;
        }

        /// <summary>
        /// 取得顧客資料
        /// </summary>
        /// <param name="id">UserId</param>
        /// <returns></returns>
        public async Task<UserProfile> GetUserInfoAsync(int userId)
        {
            var userProfile = await _unitOfWork.UserProfiles.ReadAsync(userProfile => userProfile.UserId == userId);
            return userProfile;
        }

        /// <summary>
        /// 更新顧客資料
        /// </summary>
        /// <param name="id">UserId</param>
        /// <param name="userProfilePutRequestDto">更新物件</param>
        /// <returns></returns>
        public async Task UpdateUserInfoAsync(int userId, UserProfilePutRequestDto userProfilePutRequestDto)
        {
            var userProfile = new UserProfile
            {
                Id = userProfilePutRequestDto.Id,
                UserName = userProfilePutRequestDto.UserName,
                PhoneNumber = userProfilePutRequestDto.PhoneNumber,
                Address = userProfilePutRequestDto.Address,
                BirthDate = DateTime.Parse(userProfilePutRequestDto.BirthDate),
                Sex = userProfilePutRequestDto.Sex
            };
            _unitOfWork.UserProfiles.UpdateByProperty(userProfile, u => u.UserName, u => u.PhoneNumber, u => u.Address, u => u.BirthDate, u => u.Sex);
            await _unitOfWork.CompleteAsync();
            return;
        }

        /// <summary>
        /// 透過UserId刪除使用者
        /// </summary>
        /// <param name="id">UserId</param>
        /// <returns></returns>
        public async Task<IdentityResult> DeleteUserAsync(int id)
        {
            var existingUser = await _userManager.Users
                                .Where(user => user.Id == id)
                                .FirstOrDefaultAsync();

            if (existingUser == null)
                throw new NullReferenceException();

            var result = await _userManager.DeleteAsync(existingUser);
            return result;
        }
    }
}