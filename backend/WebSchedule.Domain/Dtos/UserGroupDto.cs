
namespace WebSchedule.Domain.Dtos
{
    public class UserGroupDto
    {
        public GroupDto Group { get; set; }
        public UserDto User { get; set; }

        public bool IsAdmin { get; set; }
        public bool IsCandidate { get; set; }
    }
}
