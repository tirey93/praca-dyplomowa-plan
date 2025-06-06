namespace WebSchedule.Controllers.Authentication.Exceptions
{
    public class LoginFailedException : ApplicationException
    {
        public LoginFailedException(string userName) : base("LoginFailedForUser", userName)
        {
        }
    }
}
