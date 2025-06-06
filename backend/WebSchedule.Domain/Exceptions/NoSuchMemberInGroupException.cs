namespace WebSchedule.Domain.Exceptions
{
    public class NoSuchMemberInGroupException : DomainException
    {
        public NoSuchMemberInGroupException(int userId, int groupId) : base("NoSuchMemberInGroup", userId.ToString(), groupId.ToString())
        {
        }


    }
}