﻿namespace WebSchedule.Controllers
{
    public class ApplicationException : Exception
    {
        public string Code { get; protected set; }
        public List<string> Params { get; protected set; }

        public ApplicationException(string code, params string[] @params) : base()
        {
            Code = code;
            Params = [.. @params];
        }
    }
}
