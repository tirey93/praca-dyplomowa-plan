namespace WebSchedule.Hubs.Dtos
{
    public class MessageDto
    {
        public UserDto User { get; set; }
        public string Content { get; set; }
        public int GroupId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
