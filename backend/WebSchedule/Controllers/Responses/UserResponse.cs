namespace WebSchedule.Controllers.Responses
{
    public class UserResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public bool IsActive { get; set; }
        public List<UserGroupResponse> Groups { get; set; }
    }
}
