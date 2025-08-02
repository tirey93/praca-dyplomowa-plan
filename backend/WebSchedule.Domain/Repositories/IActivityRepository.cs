
using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface IActivityRepository : IRepository<Activity>
    {
        IEnumerable<Activity> GetActivitiesForSession(int groupId, int sessionNumber, bool springSemester);
    }
}