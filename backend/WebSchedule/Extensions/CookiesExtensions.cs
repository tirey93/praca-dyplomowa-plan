
namespace WebSchedule.Extensions
{
    public static class CookiesExtensions
    {
        public static IResponseCookies AppendToCookie(this IResponseCookies cookies, string key, string value)
        {
            cookies.Append(key,
               value,
               new CookieOptions()
               {
                   SameSite = SameSiteMode.None,
                   Secure = true,
                   HttpOnly = true,
                   MaxAge = new TimeSpan(12, 0, 0),
                   Domain = "localhost"
               });

            return cookies;
        }
    }
}
