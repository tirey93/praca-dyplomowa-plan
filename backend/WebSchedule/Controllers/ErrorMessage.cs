using WebSchedule.Domain;

namespace WebSchedule.Controllers
{
    public class ErrorMessage
    {
        public string Code { get; private set; }
        public List<string> Params { get; private set; }

        public ErrorMessage(string code, List<string> @params = null)
        {
            Code = code;
            Params = @params;
        }
    }

    public static class ErrorMessageExtenstions
    {
        public static ErrorMessage FromApplicationException(this ApplicationException exception)
            => new(exception.Code, exception.Params);
        public static ErrorMessage FromDomainException(this DomainException exception)
            => new(exception.Code, exception.Params);
        public static ErrorMessage FromSystemException(this SystemException exception)
            => new(exception.Code, exception.Params);
    }
}
