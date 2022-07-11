using System.IO;
using System.Threading.Tasks;
using CeShop.Domain.Dtos.Outgoings;
using Microsoft.AspNetCore.Http;

namespace CeShop.Business.ILogics
{
    public interface IImagesLogic
    {
        /// <summary>
        /// 取得AWS S3照片檔案
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public Task<Stream> GetS3ImageFileAsync(string name);

        /// <summary>
        /// 上傳至AWS S3 Bucket
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        public Task<S3UploadOutgoingDto> UploadS3ImageFileAsync(IFormFile file);
    }
}