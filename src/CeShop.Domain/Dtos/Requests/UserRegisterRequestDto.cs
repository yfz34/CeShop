using System.ComponentModel.DataAnnotations;

namespace CeShop.Domain.Dtos.Requests
{
    public class UserRegisterRequestDto
    {
        [Required(ErrorMessage = "UserName is required")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        public string Email { get; set; }
    }
}