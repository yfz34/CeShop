namespace CeShop.Domain.Dtos.Incomings
{
    public class S3GetIncomingDto
    {
        public string Name { get; set; } = null!;
        public string BucketName { get; set; } = null!;
    }
}