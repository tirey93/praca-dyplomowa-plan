namespace WebSchedule.Controllers
{
    public class ApplicationException : Exception
    {
        public string Code { get; protected set; }

        public ApplicationException(string message) : base(message) { }
    }
}
