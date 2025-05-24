namespace WebSchedule.Controllers.Responses
{
    public class UserGroupResponse : GroupResponse
    {
        public bool IsAdmin { get; set; }
        public bool IsCandidate { get; set; }
    }
}
