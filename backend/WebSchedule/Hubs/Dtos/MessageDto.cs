namespace WebSchedule.Hubs.Dtos
{
    public class MessageDto
    {
        public string Content { get; set; }
        public int GroupId { get; set; }
        public UserDto User { get; set; }
    }
}
