
namespace WebSchedule.Domain.Dtos
{
    public class UserGroupDto : GroupDto
    {
        public int UserId { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsCandidate { get; set; }
    }
}
