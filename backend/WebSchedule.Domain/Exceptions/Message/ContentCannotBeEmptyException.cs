
namespace WebSchedule.Domain.Exceptions.Message
{
    internal class ContentCannotBeEmptyException : DomainException
    {
        public ContentCannotBeEmptyException() : base("ExceptionContentCannotBeEmpty")
        {
        }
    }
}
