using WebSchedule.Constants;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Org.BouncyCastle.Asn1.Ocsp;
using Microsoft.Extensions.Primitives;
using WebSchedule.Extensions;
using System.Net;

namespace WebSchedule.Utils
{
    public class JwtHelper
    {
        public static JwtSecurityToken GetJwtToken(
            string userId,
            string signingKey,
            string issuer,
            string audience,
            TimeSpan expiration,
            Claim[] additionalClaims = null)
        {
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.NameId, userId),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            if (additionalClaims is object)
            {
                var claimList = new List<Claim>(claims);
                claimList.AddRange(additionalClaims);
                claims = claimList.ToArray();
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            return new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                expires: DateTime.UtcNow.Add(expiration),
                claims: claims,
                signingCredentials: creds
            );
        }

        public static int? GetUserIdFromToken(StringValues authorization)
        {
            var tokenStr = authorization.GetToken();
            if(string.IsNullOrEmpty(tokenStr)) 
                return null;
            var jwtHandler = new JwtSecurityTokenHandler();
            var token = jwtHandler.ReadJwtToken(tokenStr);

            var stringUserId = token.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.NameId).Value;
            if (!int.TryParse(stringUserId, out int userId))
                return null;

            return userId;
        }
    }
}

