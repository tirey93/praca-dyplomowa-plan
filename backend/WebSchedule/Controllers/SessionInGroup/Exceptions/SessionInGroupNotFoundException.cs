namespace WebSchedule.Controllers.SessionInGroup.Exceptions
{
    public class SessionInGroupNotFoundException : ApplicationException
    {
        public SessionInGroupNotFoundException() : base("ExceptionSessionInGroupNotFound")
        { }
    }
}
