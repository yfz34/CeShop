using System;

namespace CeShop.Domain.Dtos.Responses
{
    public class UserProfileResponseDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Country { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string BirthDate { get; set; }
        public string Sex { get; set; }
    }
}