using WebSchedule.Constants;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace WebSchedule.Utils
{
    public class JwtHelper
    {
        public static JwtSecurityToken GetJwtToken(
            string username,
            string signingKey,
            string issuer,
            string audience,
            TimeSpan expiration,
            Claim[] additionalClaims = null)
        {
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub,username),
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

        public static string GetRoleClaimFromCookie(IHttpContextAccessor httpContextAccessor)
        {
            if (httpContextAccessor.HttpContext.User.Identity is not ClaimsIdentity identity)
                return null;

            IEnumerable<Claim> claims = identity.Claims;
            var roleClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);

            return roleClaim?.Value;
        }

        public static int? GetUserIdFromCookies(IHttpContextAccessor httpContextAccessor)
        {
            if (!httpContextAccessor.HttpContext.Request.Cookies.TryGetValue(Cookies.UserId, out string cookiesUserId))
                return null;

            if (!int.TryParse(cookiesUserId, out int userId))
                return null;

            return userId;
        }
    }
}

