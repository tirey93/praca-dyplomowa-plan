
using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface IActivityRepository : IRepository<Activity>
    {
        IEnumerable<Activity> GetActivitiesForDay(int groupId, int[] sessionNumbers, bool springSemester, WeekDay weekDay);
    }
}