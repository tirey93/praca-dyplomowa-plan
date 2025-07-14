
namespace WebSchedule.Controllers.UserInGroup.Exceptions
{
    public class UserNotFoundInGroupException : ApplicationException
    {
        public UserNotFoundInGroupException(int userId, int groupId) : base("ExceptionUserNotFoundInGroupException", userId.ToString(), groupId.ToString())
        {
        }
    }
}
