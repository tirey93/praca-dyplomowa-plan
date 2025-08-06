namespace WebSchedule.Controllers.Responses
{
    public class ActivityResponse
    {
        public int ActivityId { get; set; }
        public string Name { get; set; }
        public string TeacherFullName { get; set; }
        public int StartingHour { get; set; }
        public int Duration { get; set; }
        public string WeekDay { get; set; }
        public SessionResponse Session { get; set; }
    }
}
