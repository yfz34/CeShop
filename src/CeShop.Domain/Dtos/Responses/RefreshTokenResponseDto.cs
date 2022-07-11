using System.Collections.Generic;
using CeShop.Domain.Dtos.Generics;

namespace CeShop.Domain.Dtos.Responses
{
    public class RefreshTokenResponseDto
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public List<RoleDto> Roles { get; set; }
    }
}