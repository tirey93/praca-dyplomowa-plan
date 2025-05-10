namespace WebSchedule.Controllers.Responses
{
    public class UserGroupResponse
    {
        public int Id { get; set; }
        public GroupInfoResponse GroupInfo { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsCandidate { get; set; }
    }
}
