namespace WebSchedule.Domain.Exceptions.Group
{
    public class NoSuchMemberInGroupException : DomainException
    {
        public NoSuchMemberInGroupException(int userId, int groupId) : base("NoSuchMemberInGroup", userId.ToString(), groupId.ToString())
        {
        }


    }
}