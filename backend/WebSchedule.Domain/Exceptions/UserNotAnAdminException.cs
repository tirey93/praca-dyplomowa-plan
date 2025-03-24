using WebSchedule.Domain.Properties;

namespace WebSchedule.Domain.Exceptions
{
    public class UserNotAnAdminException : DomainException
    {
        public UserNotAnAdminException(int userId) : base(string.Format(Resource.UserNotAnAdmin, userId))
        {
        }
    }
}
