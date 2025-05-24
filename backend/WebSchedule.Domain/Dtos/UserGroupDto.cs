
namespace WebSchedule.Domain.Dtos
{
    public class UserGroupDto : GroupDto
    {
        public bool IsAdmin { get; set; }
        public bool IsCandidate { get; set; }
    }
}
