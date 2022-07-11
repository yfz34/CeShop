using System.ComponentModel.DataAnnotations;

namespace CeShop.Domain.Dtos.Requests
{
    public class UserLoginRequestDto
    {
        [Required(ErrorMessage = "Account is required")]
        public string Account { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}