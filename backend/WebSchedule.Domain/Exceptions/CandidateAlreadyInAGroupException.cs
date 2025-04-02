using WebSchedule.Domain.Properties;

namespace WebSchedule.Domain.Exceptions
{
    public class CandidateAlreadyInAGroupException : DomainException
    {
        public CandidateAlreadyInAGroupException(int userId, int groupId) : base(string.Format(Resource.CandidateAlreadyInAGroupException, userId, groupId))
        {
        }


    }
}