using System;
using System.IO;
using System.Threading.Tasks;
using AwsS3.Services;
using CeShop.Business.ILogics;
using CeShop.Domain.Dtos.Incomings;
using CeShop.Domain.Dtos.Outgoings;
using CeShop.Domain.Settings;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace CeShop.Business.Logics
{
    public class ImagesLogic : IImagesLogic
    {
        private readonly AwsConfiguration _awsConfiguration;
        private readonly IS3StorageService _s3StorageService;

        public ImagesLogic(IOptions<AwsConfiguration> awsConfiguration, IS3StorageService s3StorageService)
        {
            _awsConfiguration = awsConfiguration.Value;
            _s3StorageService = s3StorageService;
        }

        public async Task<Stream> GetS3ImageFileAsync(string name)
        {
            var s3Obj = new S3GetIncomingDto()
            {
                BucketName = _awsConfiguration.AwsBucketName,
                Name = name + ".jpeg"
            };

            var response = await _s3StorageService.GetFileAsync(s3Obj);

            if (response.HttpStatusCode != System.Net.HttpStatusCode.OK)
                return null;

            return response.ResponseStream;
        }

        public async Task<S3UploadOutgoingDto> UploadS3ImageFileAsync(IFormFile file)
        {
            // Process the file
            await using var memoryStr = new MemoryStream();
            await file.CopyToAsync(memoryStr);

            var s3Obj = new S3UploadIncomingDto()
            {
                BucketName = _awsConfiguration.AwsBucketName,
                InputStream = memoryStr,
                FileName = Guid.NewGuid().ToString(),
                FileExtension = "jpeg"
            };

            var result = await _s3StorageService.UploadFileAsync(s3Obj);

            return result;
        }
    }
}