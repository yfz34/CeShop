using System.IO;

namespace CeShop.Domain.Dtos.Incomings
{
    public class S3UploadIncomingDto
    {
        public string FileName { get; set; } = null!;
        public string FileExtension { get; set; } = null!;
        public MemoryStream InputStream { get; set; } = null!;
        public string BucketName { get; set; } = null!;
    }
}