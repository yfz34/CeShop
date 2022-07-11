using System.ComponentModel.DataAnnotations;

namespace CeShop.Domain.Dtos.Requests
{
    public class RefreshTokenRequestDto
    {
        [Required]
        public string AccessToken { get; set; }

        [Required]
        public string RefreshToken { get; set; }
    }
}