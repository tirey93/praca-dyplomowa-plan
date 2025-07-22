
namespace WebSchedule.Domain.Exceptions.Message
{
    internal class ContentCannotBeThatLargeException : DomainException
    {
        public ContentCannotBeThatLargeException(int max) : base("ExceptionContentCannotBeThatLarge", max.ToString())
        {
        }
    }
}
