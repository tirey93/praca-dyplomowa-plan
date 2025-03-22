using WebSchedule.Properties;

namespace WebSchedule.Controllers.Authentication.Exceptions
{
    public class LoginFailedException : ApplicationException
    {
        public LoginFailedException() : base(string.Format(Resource.ExceptionNoneUserNotFound))
        {
        }
        public LoginFailedException(int userId) : base(string.Format(Resource.ExceptionUserNotFound, userId)) 
        {
        }
        public LoginFailedException(string userName) : base(string.Format(Resource.ExceptionUserNameNotFound, userName))
        {
        }
    }
}
