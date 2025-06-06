
namespace WebSchedule.Controllers.Group.Exceptions
{
    public class GroupNotFoundException : ApplicationException
    {
        public GroupNotFoundException(int groupId) : base("ExceptionGroupNotFound", groupId.ToString())
        {
        }
    }
}
