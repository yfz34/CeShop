using System.Collections.Generic;
using CeShop.Domain.Dtos.Generics;

namespace CeShop.Domain.Dtos.Outgoings
{
    public class UserLoginOutgoingDto : Result
    {
        public TokenData TokenData { get; set; }
        public List<RoleDto> Roles { get; set; }
    }
}