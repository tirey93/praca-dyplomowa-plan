using WebSchedule.Domain.Properties;

namespace WebSchedule.Domain.Exceptions
{
    public class UserNotBelongToTheGroupException : DomainException
    {
        public UserNotBelongToTheGroupException(int userId, string group) : base(string.Format(Resource.UserNotAnAdmin, userId, group))
        {
        }
    }
}
