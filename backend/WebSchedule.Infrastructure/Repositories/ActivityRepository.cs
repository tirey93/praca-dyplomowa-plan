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

        public IEnumerable<Activity> GetActivitiesForDay(int groupId, int[] sessionNumbers, bool springSemester, WeekDay weekDay)
        {
            return _dbSet
                .Include(x => x.Session)
                .Where(x => x.Session.GroupId == groupId 
                    && x.Session.SpringSemester == springSemester
                    && x.WeekDay == weekDay
                    && sessionNumbers.Contains(x.Session.Number));
        }

        public async Task AddActivity(Activity activity)
        {
            await _dbSet.AddAsync(activity);
        }
    }
}
