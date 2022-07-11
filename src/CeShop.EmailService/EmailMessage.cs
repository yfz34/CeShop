using Microsoft.AspNetCore.Http;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CeShop.EmailService
{
    public class EmailMessage
    {
        /// <summary>
        /// 接收者Email
        /// </summary>
        /// <value></value>
        public List<MailboxAddress> To { get; set; }

        /// <summary>
        /// 標題
        /// </summary>
        /// <value></value>
        public string Subject { get; set; }

        /// <summary>
        /// 內文
        /// </summary>
        /// <value></value>
        public string Content { get; set; }

        /// <summary>
        /// 附加檔案
        /// </summary>
        /// <value></value>
        public IFormFileCollection Attachments { get; set; }

        public EmailMessage(IEnumerable<string> to, string subject, string content, IFormFileCollection attachments)
        {
            To = new List<MailboxAddress>();

            To.AddRange(to.Select(x => new MailboxAddress(x)));
            Subject = subject;
            Content = content;
            Attachments = attachments;
        }
    }
}