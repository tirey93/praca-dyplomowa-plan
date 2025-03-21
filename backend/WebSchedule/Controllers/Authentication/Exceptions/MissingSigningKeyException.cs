using WebSchedule.Properties;

namespace WebSchedule.Controllers.Authentication.Exceptions
{
    public class MissingSigningKeyException : Exception
    {
        public MissingSigningKeyException() : base(Resource.ExceptionSigningKeyIsMissing)
        {
        }
    }
}
