
using WebSchedule.Properties;

namespace Domain.Exceptions
{
    public class UserIsNotActiveException : ApplicationException
    {
        public UserIsNotActiveException(int userId) : base(string.Format(Resource.ExceptionUserIsNotActive, userId))
        {
        }
    }
}
