using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using AwsS3.Services;
using CeShop.Domain.Dtos.Incomings;
using CeShop.Domain.Dtos.Outgoings;

namespace CeShop.Data.Service.Services
{
    public class S3StorageService : IS3StorageService
    {
        private readonly IAmazonS3 _s3Client;

        public S3StorageService(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }

        public async Task<GetObjectResponse> GetFileAsync(S3GetIncomingDto s3GetIncoming)
        {
            return await _s3Client.GetObjectAsync(s3GetIncoming.BucketName, s3GetIncoming.Name);
        }

        public async Task<S3UploadOutgoingDto> UploadFileAsync(S3UploadIncomingDto s3UploadIncoming)
        {
            var response = new S3UploadOutgoingDto();
            response.FileName = s3UploadIncoming.FileName;
            response.FileExtension = s3UploadIncoming.FileExtension;

            try
            {
                // Create the upload request
                var uploadRequest = new TransferUtilityUploadRequest()
                {
                    InputStream = s3UploadIncoming.InputStream,
                    Key = s3UploadIncoming.FileName + "." + s3UploadIncoming.FileExtension,
                    BucketName = s3UploadIncoming.BucketName,
                    CannedACL = S3CannedACL.NoACL
                };

                var transferUtiltiy = new TransferUtility(_s3Client);

                // uploading the file to S3
                await transferUtiltiy.UploadAsync(uploadRequest);

                response.StatusCode = 200;
                response.Message = $"{s3UploadIncoming.FileName} has been uploaded successfully";
            }
            catch (AmazonS3Exception ex)
            {
                response.StatusCode = (int)ex.StatusCode;
                response.Message = ex.Message;
            }
            catch (Exception ex)
            {
                response.StatusCode = 500;
                response.Message = ex.Message;
            }

            return response;
        }
    }
}

