namespace WebSchedule.Controllers.Authentication.Exceptions
{
    public class MissingSigningKeyException : SystemException
    {
        public MissingSigningKeyException() : base("ExceptionSigningKeyIsMissing")
        {
        }
    }
}
