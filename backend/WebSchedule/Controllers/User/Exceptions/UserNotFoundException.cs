namespace WebSchedule.Controllers.User.Exceptions
{
    public class UserNotFoundException : ApplicationException
    {
        public UserNotFoundException(string userId) : base("ExceptionUserNotFound", userId)
        { }

        public UserNotFoundException() : base("ExceptionNoneUserNotFound")
        { }
    }
}
