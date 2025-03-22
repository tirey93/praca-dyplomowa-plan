namespace WebSchedule.Domain.Entities
{
    public class User : Entity
    {
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public Role Role { get; set; }
        public string HashedPassword { get; set; }
        public bool IsActive { get; set; }
    }
}
