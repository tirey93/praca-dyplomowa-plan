
namespace WebSchedule.Controllers.UserInGroup.Exceptions
{
    public class UserInGroupNotFoundException : ApplicationException
    {
        public UserInGroupNotFoundException(int userId, int groupId) : base("ExceptionUserInGroupNotFoundException", userId.ToString(), groupId.ToString())
        {
        }
    }
}
