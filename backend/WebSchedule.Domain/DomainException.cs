namespace WebSchedule.Domain
{
    public class DomainException : Exception
    {
        public string Code { get; protected set; }
        public List<string> Params { get; protected set; }

        public DomainException(string code, params string[] @params) : base()
        {
            Code = code;
            Params = [.. @params];
        }
    }
}
