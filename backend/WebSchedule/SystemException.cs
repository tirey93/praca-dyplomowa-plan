namespace WebSchedule
{
    public class SystemException : Exception
    {
        public string Code { get; protected set; }
        public List<string> Params { get; protected set; }

        public SystemException(string code, params string[] @params) : base()
        {
            Code = code;
            Params = [.. @params];
        }
    }
}
