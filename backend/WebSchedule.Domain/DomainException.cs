using System.Threading.Tasks;

namespace WebSchedule.Domain
{
    public class DomainException : Exception
    {
        public DomainException(string message) : base(message) { }
    }
}
