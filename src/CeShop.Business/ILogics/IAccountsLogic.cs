using System.Threading.Tasks;
using CeShop.Domain.Dtos.Generics;
using CeShop.Domain.Dtos.Incomings;
using CeShop.Domain.Dtos.Outgoings;
using CeShop.Domain.Dtos.Requests;

namespace CeShop.Business.ILogics
{
    /// <summary>
    /// 帳戶管理邏輯處理介面
    /// </summary>
    public interface IAccountsLogic
    {
        /// <summary>
        /// 使用者註冊邏輯處理
        /// </summary>
        /// <param name="userRegisterRequestDto">註冊物件</param>
        /// <returns></returns>
        public Task<UserRegisterOutgoingDto> Register(UserRegisterRequestDto userRegisterRequestDto);

        /// <summary>
        /// 驗證使用者Email邏輯處理
        /// </summary>
        /// <param name="emailToken">email token</param>
        /// <param name="email">email</param>
        /// <returns></returns>
        public Task<Result> ConfirmEmail(string emailToken, string email);

        /// <summary>
        /// 使用者登入邏輯處理
        /// </summary>
        /// <param name="userLoginIncomingDto">登入物件</param>
        /// <returns></returns>
        public Task<UserLoginOutgoingDto> Login(UserLoginIncomingDto userLoginIncomingDto);

        /// <summary>
        /// refresh token邏輯處理
        /// </summary>
        /// <param name="refreshToken">Refresh Token</param>
        /// <param name="ipAddress">IP位置</param>
        /// <returns></returns>
        public Task<UserRefreshTokenOutgoingDto> RefreshToken(string refreshToken, string ipAddress);

        /// <summary>
        /// 登出邏輯處理
        /// </summary>
        /// <param name="refreshToken">Refresh Token</param>
        /// <param name="ipAddress">IP位置</param>
        /// <returns></returns>
        public Task<Result> Logout(string refreshToken, string ipAddress);
    }
}