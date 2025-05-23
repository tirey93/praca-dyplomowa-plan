using WebSchedule.Properties;

namespace WebSchedule.Controllers.Group.Exceptions
{
    public class GroupNotFoundException : ApplicationException
    {
        public GroupNotFoundException(int groupId) : base(string.Format(Resource.ExceptionGroupNotFound, groupId.ToString()))
        {
        }
    }
}
