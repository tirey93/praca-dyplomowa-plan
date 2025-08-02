using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Infrastructure.Repositories
{
    public class ActivityRepository : Repository<Activity>, IActivityRepository
    {
        public ActivityRepository(AppDbContext appDbContext)
            : base(appDbContext, appDbContext.Activities)
        {
        }

        public IEnumerable<Activity> GetConflicts(int sessionId, int startingHour, int duration)
        {
            return _dbSet.Where(x => x.SessionId == sessionId && x.IsOverlapping(startingHour, duration));
        }
    }
}
