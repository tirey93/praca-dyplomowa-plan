
namespace WebSchedule.Controllers.Activity.Exceptions
{
    public class ActivityNotFoundException : ApplicationException
    {
        public ActivityNotFoundException(int activityId) : base("ExceptionActivityNotFound", activityId.ToString())
        {
        }
    }
}
