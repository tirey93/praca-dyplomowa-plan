namespace WebSchedule.Controllers.User.Exceptions
{
    public class CurrentPasswordDidntMatchException : ApplicationException
    {
        public CurrentPasswordDidntMatchException() : base("ExceptionCurrentPasswordDidntMatch")
        { }
    }
}
