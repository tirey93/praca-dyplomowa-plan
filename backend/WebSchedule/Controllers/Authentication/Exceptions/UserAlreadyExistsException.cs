namespace WebSchedule.Controllers.Authentication.Exceptions
{
    public class UserAlreadyExistsException : ApplicationException
    {
        public UserAlreadyExistsException(string userName) : base("ExceptionUserAlreadyExists", userName)
        {
        }
    }
}
