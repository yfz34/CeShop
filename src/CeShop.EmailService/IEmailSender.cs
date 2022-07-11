using System.Threading.Tasks;

namespace CeShop.EmailService
{
    /// <summary>
    /// 發送Email介面
    /// </summary>
    public interface IEmailSender
    {
        /// <summary>
        /// 發送Email
        /// </summary>
        /// <param name="message">EmailMessage物件</param>
        public void SendEmail(EmailMessage message);

        /// <summary>
        /// 非同步發送Email
        /// </summary>
        /// <param name="message">EmailMessage物件</param>
        public Task SendEmailAsync(EmailMessage message);
    }
}