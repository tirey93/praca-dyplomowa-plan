namespace WebSchedule.Controllers.Responses
{
    public class ActivityInSessionResponse
    {
        public int SessionNumber { get; set; }
        public IEnumerable<ActivityResponse> Activities { get; set; }
    }
}
