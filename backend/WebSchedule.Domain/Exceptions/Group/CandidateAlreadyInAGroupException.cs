namespace WebSchedule.Domain.Exceptions.Group
{
    public class CandidateAlreadyInAGroupException : DomainException
    {
        public CandidateAlreadyInAGroupException(int userId, int groupId) : base("CandidateAlreadyInAGroupException", userId.ToString(), groupId.ToString())
        {
        }


    }
}