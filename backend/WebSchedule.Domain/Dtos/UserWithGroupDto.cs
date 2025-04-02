
namespace WebSchedule.Domain.Dtos
{
    public class UserWithGroupDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public bool IsActive { get; set; }
        public List<UserGroupDto> Groups { get; set; }
    }
}
