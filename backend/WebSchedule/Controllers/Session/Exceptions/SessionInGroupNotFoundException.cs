namespace WebSchedule.Controllers.Session.Exceptions
{
    public class SessionInGroupNotFoundException : ApplicationException
    {
        public SessionInGroupNotFoundException() : base("ExceptionSessionInGroupNotFound")
        { }
    }
}
