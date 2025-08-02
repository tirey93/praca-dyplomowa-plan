using Microsoft.EntityFrameworkCore;
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

        public IEnumerable<Activity> GetActivitiesForSession(int groupId, int sessionNumber, bool springSemester)
        {
            return _dbSet
                .Include(x => x.Session)
                .Where(x => x.Session.GroupId == groupId 
                    && x.Session.SpringSemester == springSemester
                    && x.Session.Number == sessionNumber);
        }
    }
}
