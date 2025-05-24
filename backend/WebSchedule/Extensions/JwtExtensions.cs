
using Microsoft.Extensions.Primitives;

namespace WebSchedule.Extensions
{
    public static class JwtExtensions
    {
        public static string GetToken(this StringValues authorization) 
            => authorization.FirstOrDefault()?.Replace("Bearer ", string.Empty);
    }
}
