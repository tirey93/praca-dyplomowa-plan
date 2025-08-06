namespace WebSchedule.Controllers.Responses
{
    public class SessionResponse
    {
        public int SessionId { get; set; }
        public int Number { get; set; }
        public int WeekNumber { get; set; }
        public bool SpringSemester { get; set; }

        public int? GroupId { get; set; }
    }
}
