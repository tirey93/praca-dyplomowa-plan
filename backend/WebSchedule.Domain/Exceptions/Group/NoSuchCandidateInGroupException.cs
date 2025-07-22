namespace WebSchedule.Domain.Exceptions.Group
{
    public class NoSuchCandidateInGroupException : DomainException
    {
        public NoSuchCandidateInGroupException(int userId, int groupId) : base("NoSuchCandidateInGroup", userId.ToString(), groupId.ToString())
        {
        }


    }
}