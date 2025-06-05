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
}
