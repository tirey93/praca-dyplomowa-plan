
namespace WebSchedule.Controllers.UserInGroup.Exceptions
{
    public class RoleNotFoundException : ApplicationException
    {
        public RoleNotFoundException(string role) : base("ExceptionRoleNotFoundException", role)
        {
        }
    }
}
