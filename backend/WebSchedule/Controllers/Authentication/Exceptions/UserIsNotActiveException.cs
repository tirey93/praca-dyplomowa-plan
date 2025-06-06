
namespace WebSchedule.Controllers.Group.Exceptions
{
    public class UserIsNotActiveException : ApplicationException
    {
        public UserIsNotActiveException(int userId) : base("ExceptionUserIsNotActive", userId.ToString())
        {
        }
    }
}
