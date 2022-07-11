using System.Threading.Tasks;
using Amazon.S3.Model;
using CeShop.Domain.Dtos.Incomings;
using CeShop.Domain.Dtos.Outgoings;

namespace AwsS3.Services
{
    public interface IS3StorageService
    {
        public Task<GetObjectResponse> GetFileAsync(S3GetIncomingDto s3GetIncoming);

        Task<S3UploadOutgoingDto> UploadFileAsync(S3UploadIncomingDto s3UploadIncoming);
    }
}

