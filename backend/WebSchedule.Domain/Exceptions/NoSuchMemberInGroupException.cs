using WebSchedule.Domain.Properties;

namespace WebSchedule.Domain.Exceptions
{
    public class NoSuchMemberInGroupException : DomainException
    {
        public NoSuchMemberInGroupException(int userId, int groupId) : base(string.Format(Resource.NoSuchMemberInGroup, userId, groupId))
        {
        }


    }
}