using WebSchedule.Properties;

namespace WebSchedule.Controllers.Authentication.Exceptions
{
    public class LoginFailedException : ApplicationException
    {
        public LoginFailedException(string userName) : base(string.Format(Resource.LoginFailedForUser, userName))
        {
        }
    }
}
