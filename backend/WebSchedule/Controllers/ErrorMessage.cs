namespace WebSchedule.Controllers
{
    public class ErrorMessage
    {
        public string Message { get; private set; }

        public ErrorMessage(string message)
        {
            Message = message;
        }
    }
}
