using System.ComponentModel.DataAnnotations;

namespace CeShop.Domain.Dtos.Requests
{
    public class UserProfilePutRequestDto
    {
        [Required]
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string BirthDate { get; set; }
        public string Sex { get; set; }
    }
}