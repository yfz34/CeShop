using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using CeShop.Domain.Settings;
using CeShop.Data.EF.Contexts;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.IConfigurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using CeShop.Domain.Dtos.Requests;
using CeShop.Domain.Dtos.Outgoings;
using CeShop.Domain.Dtos.Generics;
using CeShop.Business.ILogics;
using CeShop.Domain.Dtos.Incomings;
using Microsoft.Extensions.Logging;

namespace CeShop.Business.Logics
{
    /// <summary>
    /// 帳戶管理邏輯處理實作
    /// </summary>
    public class AccountsLogic : IAccountsLogic
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly JwtSetting _jwtSetting;
        private readonly ILogger<AccountsLogic> _logger;

        public AccountsLogic(
            IUnitOfWork unitOfWork,
            UserManager<AppUser> userManager,
            RoleManager<AppRole> roleManager,
            CeShopDbContext dbContext,
            IOptions<JwtSetting> jwtSetting,
            ILogger<AccountsLogic> logger
        )
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _roleManager = roleManager;
            _jwtSetting = jwtSetting.Value;
            _logger = logger;
        }

        /// <summary>
        /// 使用者註冊邏輯處理
        /// </summary>
        /// <param name="userRegisterRequestDto">註冊物件</param>
        /// <returns></returns>
        public async Task<UserRegisterOutgoingDto> Register(UserRegisterRequestDto userRegisterRequestDto)
        {
            var userRegisterOutgoingDto = new UserRegisterOutgoingDto { };

            var existingUserByEmail = await _userManager.FindByEmailAsync(userRegisterRequestDto.Email);
            if (existingUserByEmail != null)
            {
                userRegisterOutgoingDto.Errors = new List<string> { "Email已存在" };
                return userRegisterOutgoingDto;
            }

            var existingUserByName = await _userManager.FindByNameAsync(userRegisterRequestDto.UserName);
            if (existingUserByName != null)
            {
                userRegisterOutgoingDto.Errors = new List<string> { "用戶名稱已存在" };
                return userRegisterOutgoingDto;
            }

            var identityUser = new AppUser() { UserName = userRegisterRequestDto.UserName, Email = userRegisterRequestDto.Email };
            var isCreated = await _userManager.CreateAsync(identityUser, userRegisterRequestDto.Password);
            if (!isCreated.Succeeded)
            {
                userRegisterOutgoingDto.Errors = isCreated.Errors.Select(p => p.Description);
                return userRegisterOutgoingDto;
            }

            // add user role
            var userRole = await _userManager.AddToRoleAsync(identityUser, "Customer");
            if (!userRole.Succeeded)
            {
                _logger.LogInformation($"The user was not abel to be added to the role");
                userRegisterOutgoingDto.Errors = userRole.Errors.Select(p => p.Description);
                return userRegisterOutgoingDto;
            }

            // insert user profile
            var userProfile = new UserProfile
            {
                UserId = identityUser.Id,
                Email = identityUser.Email,
                CreateTime = DateTime.UtcNow,
                UpdateTime = DateTime.UtcNow
            };
            await _unitOfWork.UserProfiles.CreateAsync(userProfile);

            // insert user cart
            var userCart = new Cart
            {
                UserId = identityUser.Id,
                CreateTime = DateTime.UtcNow,
                UpdateTime = DateTime.UtcNow
            };
            await _unitOfWork.Carts.CreateAsync(userCart);

            await _unitOfWork.CompleteAsync();

            var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(identityUser);
            userRegisterOutgoingDto.EmailToken = emailToken;

            return userRegisterOutgoingDto;
        }

        /// <summary>
        /// 驗證使用者Email邏輯處理
        /// </summary>
        /// <param name="emailToken">email token</param>
        /// <param name="email">email</param>
        /// <returns></returns>
        public async Task<Result> ConfirmEmail(string emailToken, string email)
        {
            var result = new Result();

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                result.Errors = new List<string> { "使用者Email不存在" };
                return result;
            }

            var confirmEmail = await _userManager.ConfirmEmailAsync(user, emailToken);
            if (confirmEmail.Succeeded == false)
            {
                result.Errors = confirmEmail.Errors.Select(e => e.Description);
                return result;
            }

            return result;
        }

        /// <summary>
        /// 使用者登入邏輯處理
        /// </summary>
        /// <param name="userLoginIncomingDto">登入物件</param>
        /// <returns></returns>
        public async Task<UserLoginOutgoingDto> Login(UserLoginIncomingDto userLoginIncomingDto)
        {
            var userLoginOutgoingDto = new UserLoginOutgoingDto { };

            var user = await ValidUserAsync(userLoginIncomingDto.Account, userLoginIncomingDto.Password);

            if (!user.Success)
            {
                userLoginOutgoingDto.Errors = user.Errors;
                return userLoginOutgoingDto;
            }

            var appRoles = await GetUserRoleAsync(user.Data);

            var tokenData = await GenerateTokens(user.Data, userLoginIncomingDto.IpAddress);

            userLoginOutgoingDto.TokenData = tokenData;
            userLoginOutgoingDto.Roles = appRoles.Select(x => new RoleDto { Id = x.Id, CName = x.CName, Name = x.Name }).ToList();

            return userLoginOutgoingDto;
        }

        /// <summary>
        /// refresh token邏輯處理
        /// </summary>
        /// <param name="refreshToken">Refresh Token</param>
        /// <param name="ipAddress">IP位置</param>
        /// <returns></returns>
        public async Task<UserRefreshTokenOutgoingDto> RefreshToken(string refreshToken, string ipAddress)
        {
            var userRefreshTokenOutgoingDto = new UserRefreshTokenOutgoingDto();

            var vaildRefreshTokenResult = await ValidRefreshTokenAsync(refreshToken);

            if (!vaildRefreshTokenResult.Success)
            {
                userRefreshTokenOutgoingDto.Errors = vaildRefreshTokenResult.Errors;
                return userRefreshTokenOutgoingDto;
            }

            await _unitOfWork.RefreshTokens.MarkRefreshTokenAsUsed(vaildRefreshTokenResult.Data, ipAddress);
            await _unitOfWork.CompleteAsync();

            var identityUser = await _userManager.FindByIdAsync(vaildRefreshTokenResult.Data.UserId.ToString());
            var appRoles = await GetUserRoleAsync(identityUser);

            var newToken = await GenerateTokens(identityUser, ipAddress);

            userRefreshTokenOutgoingDto.TokenData = newToken;
            userRefreshTokenOutgoingDto.Roles = appRoles.Select(x => new RoleDto { Id = x.Id, CName = x.CName, Name = x.Name }).ToList();

            return userRefreshTokenOutgoingDto;
        }

        /// <summary>
        /// 登出邏輯處理
        /// </summary>
        /// <param name="refreshToken">Refresh Token</param>
        /// <param name="ipAddress">IP位置</param>
        /// <returns></returns>
        public async Task<Result> Logout(string refreshToken, string ipAddress)
        {
            var result = new Result();

            var existingRefreshToken = await _unitOfWork.RefreshTokens.ReadAsync(x => x.Token == refreshToken);

            if (existingRefreshToken == null)
            {
                result.Errors = new List<string> { "Refresh Token不存在" };
                return result;
            }

            var identityUser = await _userManager.FindByIdAsync(existingRefreshToken.UserId.ToString());

            if (identityUser == null)
            {
                result.Errors = new List<string> { "user不存在" };
                return result;
            }

            // Revoke Refresh token
            existingRefreshToken.IsRevoked = true;
            existingRefreshToken.RevokedByIp = ipAddress;
            existingRefreshToken.RevokedTime = DateTime.UtcNow;

            _unitOfWork.RefreshTokens.Update(existingRefreshToken);
            await _unitOfWork.CompleteAsync();

            return result;
        }

        /// <summary>
        ///  驗證使用者帳號密碼
        /// </summary>
        /// <param name="account">用戶名或Email</param>
        /// <param name="password">密碼</param>
        /// <returns></returns>
        private async Task<Result<AppUser>> ValidUserAsync(string account, string password)
        {
            var result = new Result<AppUser>();

            var appUser = new AppUser();

            var existingUserByName = await _userManager.FindByNameAsync(account);

            var existingUserByEmail = await _userManager.FindByEmailAsync(account);

            if (existingUserByName == null && existingUserByEmail == null)
            {
                result.Errors = new List<string> { "使用者不存在" };
                return result;
            }

            appUser = existingUserByName != null ? existingUserByName : existingUserByEmail;

            var isCorrect = await _userManager.CheckPasswordAsync(appUser, password);

            if (!isCorrect)
            {
                result.Errors = new List<string> { "密碼錯誤" };
                return result;
            }

            result.Data = appUser;

            return result;
        }

        /// <summary>
        /// 驗證Refresh Token
        /// </summary>
        /// <param name="refreshToken">Refresh Token</param>
        /// <returns></returns>
        private async Task<Result<RefreshToken>> ValidRefreshTokenAsync(string refreshToken)
        {
            var result = new Result<RefreshToken>();

            var existingRefreshToken = await _unitOfWork.RefreshTokens.ReadAsync(x => x.Token == refreshToken);

            if (existingRefreshToken == null)
            {
                result.Errors = new List<string> { "Refresh token不存在" };
                return result;
            }

            // if (existingRefreshToken.CreatedTime.Add(_jwtSetting.ExpiryTimeFrame) > DateTime.UtcNow)
            // {
            //     return new BadRequestObjectResult(new { Message = "Access Token尚未過期" });
            // }

            // Check the expiry date of a refresh token
            if (existingRefreshToken.ExpiryTime < DateTime.UtcNow)
            {
                result.Errors = new List<string> { "Refresh token已過期，請重新登入" };
                return result;
            }

            // Check if refresh token has been used or not
            if (existingRefreshToken.IsUsed)
            {
                result.Errors = new List<string> { "Refresh token已被使用" };
                return result;
            }

            if (existingRefreshToken.IsRevoked)
            {
                result.Errors = new List<string> { "Refresh token已失效，請重新登入" };
                return result;
            }

            result.Data = existingRefreshToken;
            return result;
        }

        /// <summary>
        /// 取得使用者角色列表
        /// </summary>
        /// <param name="user">AppUser物件</param>
        /// <returns>AppRole List</returns>
        private async Task<List<AppRole>> GetUserRoleAsync(AppUser user)
        {
            var userRoles = await _userManager.GetRolesAsync(user);
            var appRoles = await _roleManager.Roles.Where(role => userRoles.Contains(role.Name)).ToListAsync();
            return appRoles;
        }

        /// <summary>
        /// 產生 AccessToken 及 RefreshToken
        /// </summary>
        /// <param name="identityUser">AppUser物件</param>
        /// <param name="ipAddress">IP位置</param>
        /// <returns>TokenData物件</returns>
        private async Task<TokenData> GenerateTokens(AppUser identityUser, string ipAddress)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            // Generate access token
            var generateAccessTokenRsult = await GenerateAccessToken(identityUser);

            // // Generate refresh token
            // var ipAddress = HttpContext.Connection.RemoteIpAddress.ToString();
            var refreshToken = GenerateRefreshToken(ipAddress, identityUser.Id, generateAccessTokenRsult.Item2);

            await _unitOfWork.RefreshTokens.CreateAsync(refreshToken);
            await _unitOfWork.CompleteAsync();

            return new TokenData
            {
                AccessToken = generateAccessTokenRsult.Item1,
                RefreshToken = refreshToken.Token
            };
        }

        /// <summary>
        /// 產生AccessToken
        /// </summary>
        /// <param name="identityUser">AppUser物件</param>
        /// <returns>jwtToken and securityTokenId</returns>
        private async Task<Tuple<string, string>> GenerateAccessToken(AppUser identityUser)
        {
            var key = Encoding.ASCII.GetBytes(_jwtSetting.SecurityKey);

            var claims = await GenerateUserClaims(identityUser);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = _jwtSetting.Issuer,
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.Add(_jwtSetting.ExpiryTimeFrame),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            // Generate a JWT securityToken, than get the serialized Token result (string)
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = tokenHandler.WriteToken(securityToken);

            return new Tuple<string, string>(jwtToken, securityToken.Id);
        }

        /// <summary>
        /// 產生使用者聲明
        /// </summary>
        /// <param name="user">AppUser</param>
        /// <returns>Claim List</returns>
        private async Task<List<Claim>> GenerateUserClaims(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Getting the claims that we have assigned to the user
            var userClaims = await _userManager.GetClaimsAsync(user);
            claims.AddRange(userClaims);

            // Get the user role and add it to the claims
            var userRoles = await _userManager.GetRolesAsync(user);

            foreach (var userRole in userRoles)
            {
                var role = await _roleManager.FindByNameAsync(userRole);

                if (role != null)
                {
                    claims.Add(new Claim(ClaimTypes.Role, userRole));

                    var roleClaims = await _roleManager.GetClaimsAsync(role);
                    foreach (var roleClaim in roleClaims)
                    {
                        claims.Add(roleClaim);
                    }
                }
            }

            return claims;
        }

        /// <summary>
        /// 產生Refresh Token
        /// </summary>
        /// <param name="ipAddress">IP位置</param>
        /// <param name="userId">UserId</param>
        /// <param name="securityTokenId">SecurityTokenId</param>
        /// <returns>RefreshToken物件</returns>
        private RefreshToken GenerateRefreshToken(string ipAddress, int userId, string securityTokenId)
        {
            return new RefreshToken
            {
                UserId = userId,
                JwtId = securityTokenId,
                Token = $"{RandomStringGenerator(25)}_{Guid.NewGuid()}",
                ExpiryTime = DateTime.UtcNow.AddDays(_jwtSetting.RefreshTokenExpiryInDays),
                CreatedTime = DateTime.UtcNow,
                CreatedByIp = ipAddress,
                IsUsed = false,
                IsRevoked = false,
            };
        }

        /// <summary>
        /// 產生隨機碼
        /// </summary>
        /// <param name="length">隨機碼長度(預設64字元)</param>
        /// <returns>隨機碼</returns>
        private string RandomStringGenerator(int length = 64)
        {
            var randomNumber = new byte[length];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);

            // var random = new Random();
            // const string chars = "ABCDEFGHIJKLMNOPURSTUVWXYZ0123456789";
            // return new string(
            //     Enumerable.Repeat(chars, length)
            //         .Select(s => s[random.Next(s.Length)])
            //         .ToArray());
        }
    }
}