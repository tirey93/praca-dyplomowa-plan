namespace WebSchedule.Controllers.Responses
{
    public class UserGroupResponse
    {
        public GroupResponse Group { get; set; }
        public UserResponse User { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsCandidate { get; set; }
    }
}
