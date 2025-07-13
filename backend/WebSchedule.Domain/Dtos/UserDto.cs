
namespace WebSchedule.Domain.Dtos
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string DisplayName { get; set; }
        public bool IsActive { get; set; }
    }
}
