
namespace WebSchedule.Controllers.Group.Exceptions
{
    public class GroupAlreadyExistsException : ApplicationException
    {
        public GroupAlreadyExistsException() : base("ExceptionGroupAlreadyExists")
        {
        }
    }
}
