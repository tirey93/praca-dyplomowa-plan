namespace WebSchedule.Domain.Exceptions
{
    public class CandidateAlreadyInAGroupException : DomainException
    {
        public CandidateAlreadyInAGroupException(int userId, int groupId) : base("CandidateAlreadyInAGroupException", userId.ToString(), groupId.ToString())
        {
        }


    }
}