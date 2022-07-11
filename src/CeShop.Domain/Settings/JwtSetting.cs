using System;

namespace CeShop.Domain.Settings
{
    public class JwtSetting
    {
        public string Issuer { get; set; }
        public string SecurityKey { get; set; }
        public TimeSpan ExpiryTimeFrame { get; set; }
        public int RefreshTokenExpiryInDays { get; set; }
    }
}