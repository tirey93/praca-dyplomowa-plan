using WebSchedule.Properties;

namespace WebSchedule.Controllers.Authentication.Exceptions
{
    public class UserNotFoundException : ApplicationException
    {
        public UserNotFoundException() : base(string.Format(Resource.ExceptionNoneUserNotFound))
        {
        }
        public UserNotFoundException(int userId) : base(string.Format(Resource.ExceptionUserNotFound, userId)) 
        {
        }
        public UserNotFoundException(string userName) : base(string.Format(Resource.ExceptionUserNameNotFound, userName))
        {
        }
    }
}
