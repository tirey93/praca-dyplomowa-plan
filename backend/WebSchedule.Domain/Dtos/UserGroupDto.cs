
namespace WebSchedule.Domain.Dtos
{
    public class UserGroupDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsCandidate { get; set; }
    }
}
