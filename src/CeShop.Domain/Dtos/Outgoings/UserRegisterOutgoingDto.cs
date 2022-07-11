using CeShop.Domain.Dtos.Generics;

namespace CeShop.Domain.Dtos.Outgoings
{
    public class UserRegisterOutgoingDto : Result
    {
        public string EmailToken { get; set; }
    }
}