using WebSchedule.Properties;

namespace WebSchedule.Controllers.User.Exceptions
{
    public class UserNotFoundException : ApplicationException
    {
        public UserNotFoundException(string userId) : base(string.Format(Resource.ExceptionUserNotFound, userId))
        {
            Code = "ExceptionUserNotFound";
            Params = [ userId ];
        }

        public UserNotFoundException() : base(string.Format(Resource.ExceptionNoneUserNotFound))
        {
            Code = "ExceptionNoneUserNotFound";
        }
    }
}
