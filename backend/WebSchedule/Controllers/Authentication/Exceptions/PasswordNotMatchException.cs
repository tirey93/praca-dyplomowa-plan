using WebSchedule.Properties;

namespace WebSchedule.Controllers.Authentication.Exceptions
{
    public class PasswordNotMatchException : ApplicationException
    {
        public PasswordNotMatchException(string username) : base(string.Format(Resource.ExceptionUserPasswordNotMatch, username)) 
        {
        }
    }
}
