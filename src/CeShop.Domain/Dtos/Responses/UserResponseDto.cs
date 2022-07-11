using System.Collections.Generic;
using CeShop.Domain.Dtos.Generics;

namespace CeShop.Domain.Dtos.Responses
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public List<RoleDto> Roles { get; set; }
        public UserProfileResponseDto UserProfile { get; set; }
    }
}