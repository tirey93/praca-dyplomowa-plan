using WebSchedule.Properties;

namespace WebSchedule.Controllers.Authentication.Exceptions
{
    public class UserAlreadyExistsException : ApplicationException
    {
        public UserAlreadyExistsException(string userName) : base(string.Format(Resource.ExceptionUserAlreadyExists, userName))
        {
        }
    }
}
