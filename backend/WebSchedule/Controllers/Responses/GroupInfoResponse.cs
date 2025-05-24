namespace WebSchedule.Controllers.Responses
{
    public class GroupInfoResponse : GroupResponse
    {
        public int MembersCount { get; set; }
        public bool IsCandidate{ get; set; }
        public bool IsMember{ get; set; }
    }
}
