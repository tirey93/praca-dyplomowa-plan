namespace WebSchedule.Domain.Exceptions
{
    public class NoSuchCandidateInGroupException : DomainException
    {
        public NoSuchCandidateInGroupException(int userId, int groupId) : base("NoSuchCandidateInGroup", userId.ToString(), groupId.ToString())
        {
        }


    }
}