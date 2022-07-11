using System;
using System.Threading.Tasks;
using CeShop.Domain.Dtos.Requests;
using CeShop.Domain.Dtos.Responses;
using CeShop.Domain.Settings;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using CeShop.Business.ILogics;
using CeShop.Domain.Dtos.Incomings;
using CeShop.EmailService;
using Swashbuckle.AspNetCore.Annotations;

namespace CeShop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [SwaggerTag("使用者帳戶管理")]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountsLogic _accountsLogic;
        private readonly JwtSetting _jwtSetting;
        private readonly IEmailSender _emailSender;

        public AccountsController(
            IAccountsLogic accountsLogic,
            IOptions<JwtSetting> jwtSetting,
            IEmailSender emailSender
        )
        {
            _accountsLogic = accountsLogic;
            _jwtSetting = jwtSetting.Value;
            _emailSender = emailSender;
        }

        /// <summary>
        /// 使用者註冊
        /// </summary>
        [HttpPost("Register")]
        public async Task<IActionResult> Register(UserRegisterRequestDto userRegisterRequestDto)
        {
            var userRegisterOutgoingDto = await _accountsLogic.Register(userRegisterRequestDto);

            if (!userRegisterOutgoingDto.Success)
            {
                return BadRequest(userRegisterOutgoingDto);
            }

            await SendEmailAsync(userRegisterOutgoingDto.EmailToken, userRegisterRequestDto.Email);

            return Ok();
        }

        /// <summary>
        /// 驗證Email
        /// </summary>
        /// <param name="token">email token</param>
        /// <param name="email">email</param>
        [HttpGet("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            var confirmEmail = await _accountsLogic.ConfirmEmail(token, email);

            if (!confirmEmail.Success)
            {
                return Redirect("/auth/error");
            }

            return Redirect("/auth/success");
        }

        /// <summary>
        /// 使用者登入
        /// </summary>
        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserLoginRequestDto userLoginRequestDto)
        {
            var userLoginIncomingDto = new UserLoginIncomingDto
            {
                Account = userLoginRequestDto.Account,
                Password = userLoginRequestDto.Password,
                IpAddress = HttpContext.Connection.RemoteIpAddress.ToString()
            };

            var userLoginOutgoingDto = await _accountsLogic.Login(userLoginIncomingDto);

            if (!userLoginOutgoingDto.Success)
            {
                return BadRequest(userLoginOutgoingDto);
            }

            SetCookieInRefreshToken(userLoginOutgoingDto.TokenData.RefreshToken);

            return Ok(userLoginOutgoingDto);
        }

        /// <summary>
        /// 刷新Access Token
        /// </summary>
        /// <param name="refreshToken">refresh token</param>
        /// <returns></returns>
        [HttpPost("RefreshToken")]
        public async Task<IActionResult> RefreshToken(string refreshToken)
        {
            var refreshTokenInCookie = HttpContext.Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshTokenInCookie) && string.IsNullOrEmpty(refreshToken))
            {
                return new BadRequestResult();
            }

            refreshToken = !string.IsNullOrEmpty(refreshToken) ? refreshToken : refreshTokenInCookie;

            var userRefreshTokenOutgoingDto = await _accountsLogic.RefreshToken(refreshToken, HttpContext.Connection.RemoteIpAddress.ToString());

            if (!userRefreshTokenOutgoingDto.Success)
            {
                return new BadRequestObjectResult(userRefreshTokenOutgoingDto);
            }

            SetCookieInRefreshToken(userRefreshTokenOutgoingDto.TokenData.RefreshToken);

            return Ok(userRefreshTokenOutgoingDto);
        }

        /// <summary>
        /// 使用者登出
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <returns></returns>
        [HttpPost("Logout")]
        public async Task<IActionResult> Logout(string refreshToken)
        {
            var refreshTokenInCookie = HttpContext.Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshTokenInCookie) && string.IsNullOrEmpty(refreshToken))
            {
                return new BadRequestResult();
            }

            refreshToken = !string.IsNullOrEmpty(refreshToken) ? refreshToken : refreshTokenInCookie;

            var logoutResult = await _accountsLogic.Logout(refreshToken, HttpContext.Connection.RemoteIpAddress.ToString());
            if (!logoutResult.Success)
            {
                return new BadRequestObjectResult(logoutResult);
            }

            // clear cookie
            ClearCookieInRefreshToken();

            return Ok();
        }

        /// <summary>
        /// 在cookie新增refreshToken
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <returns></returns>
        private bool SetCookieInRefreshToken(string refreshToken)
        {
            try
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Expires = DateTime.UtcNow.AddDays(_jwtSetting.RefreshTokenExpiryInDays)
                };
                HttpContext.Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);

                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// 在cookie清除refreshToken
        /// </summary>
        /// <returns></returns>
        private bool ClearCookieInRefreshToken()
        {
            try
            {
                HttpContext.Response.Cookies.Delete("refreshToken");

                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// 發送Email確認信
        /// </summary>
        private async Task SendEmailAsync(string emailToken, string email)
        {
            var confirmationLink = Url.Action(nameof(ConfirmEmail), "Accounts", new { token = emailToken, email = email }, Request.Scheme);
            var message = new EmailMessage(new string[] { email }, "CeShop Email確認信", confirmationLink, null);
            await _emailSender.SendEmailAsync(message);
        }
    }
}