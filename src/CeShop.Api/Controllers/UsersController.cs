using System.Linq;
using System.Threading.Tasks;
using CeShop.Domain.Dtos.Responses;
using CeShop.Data.EF.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CeShop.Domain.Dtos.Requests;
using System;
using CeShop.Domain.Dtos.Generics;
using CeShop.Business.ILogics;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Swashbuckle.AspNetCore.Annotations;

namespace CeShop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [SwaggerTag("使用者管理")]
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly IUsersLogic _usersLogic;

        public UsersController(ILogger<UsersController> logger, UserManager<AppUser> userManager, IUsersLogic usersLogic)
        {
            _logger = logger;
            _userManager = userManager;
            _usersLogic = usersLogic;
        }

        /// <summary>
        /// 取得所有使用者資料
        /// </summary>
        /// <returns></returns>
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Get()
        {
            var users = await _usersLogic.GetAllUsersAsync();

            var userResponseDto = users.Select(user => new UserResponseDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Roles = user.UserRoles.Select(ur => new RoleDto
                {
                    Name = ur.Role.Name,
                    CName = ur.Role.CName
                }).ToList(),
                UserProfile = new UserProfileResponseDto
                {
                    Id = user.UserProfile.Id,
                    UserName = user.UserProfile.UserName,
                    Email = user.UserProfile.Email,
                    Country = user.UserProfile.Country,
                    Address = user.UserProfile.Address,
                    PhoneNumber = user.UserProfile.PhoneNumber,
                    BirthDate = user.UserProfile.BirthDate?.ToString("yyyy-MM-dd"),
                    Sex = user.UserProfile.Sex
                }
            });

            return Ok(userResponseDto);
        }

        /// <summary>
        /// 取得顧客資料
        /// </summary>
        /// <returns></returns>
        [HttpGet("UserInfo")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetUserInfo()
        {
            var loggedInUser = await _userManager.GetUserAsync(HttpContext.User);

            if (loggedInUser == null)
                return BadRequest("User not Found");

            var profile = await _usersLogic.GetUserInfoAsync(loggedInUser.Id);

            if (profile == null)
                return BadRequest("Profile not Found");

            var userProfileResponseDto = new UserProfileResponseDto
            {
                Id = profile.Id,
                UserName = profile.UserName,
                Email = profile.Email,
                Country = profile.Country,
                Address = profile.Address,
                PhoneNumber = profile.PhoneNumber,
                BirthDate = profile.BirthDate?.ToString("yyyy-MM-dd"),
                Sex = profile.Sex
            };

            return Ok(userProfileResponseDto);
        }

        /// <summary>
        /// 更新顧客資料
        /// </summary>
        /// <param name="userProfilePutRequestDto">更新物件</param>
        /// <returns></returns>
        [HttpPut]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> UpdateUserInfo(UserProfilePutRequestDto userProfilePutRequestDto)
        {
            var loggedInUser = await _userManager.GetUserAsync(HttpContext.User);

            if (loggedInUser == null)
                return BadRequest("User not Found");


            if (!DateTime.TryParse(userProfilePutRequestDto.BirthDate, out var birthDate))
            {
                return BadRequest("生日日期格式錯誤");
            }

            await _usersLogic.UpdateUserInfoAsync(loggedInUser.Id, userProfilePutRequestDto);

            return NoContent();
        }

        /// <summary>
        /// 透過UserId刪除使用者
        /// </summary>
        /// <param name="id">UserId</param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var result = await _usersLogic.DeleteUserAsync(id);

                if (!result.Succeeded)
                    return BadRequest();

                return Ok();
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