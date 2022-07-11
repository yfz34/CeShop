namespace CeShop.Domain.Dtos.Outgoings
{
    public class S3UploadOutgoingDto
    {
        public int StatusCode { get; set; } = 200;
        public string Message { get; set; } = "";
        public string FileName { get; set; } = "";
        public string FileExtension { get; set; } = "";
    }
}