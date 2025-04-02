using WebSchedule.Domain.Properties;

namespace WebSchedule.Domain.Exceptions
{
    public class NoSuchCandidateInGroupException : DomainException
    {
        public NoSuchCandidateInGroupException(int userId, int groupId) : base(string.Format(Resource.NoSuchCandidateInGroup, userId, groupId))
        {
        }


    }
}