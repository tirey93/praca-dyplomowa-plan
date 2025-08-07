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

        public Activity Get(int id)
        {
            return _dbSet
                .Include(x => x.Session)
                .FirstOrDefault(x => x.Id == id);
        }

        public IEnumerable<Activity> GetActivitiesForWeek(int[] groupIds, int weekNumber, bool springSemester)
        {
            return _dbSet
                .Include(x => x.Session)
                .Where(x => x.Session.GroupId != null
                    && groupIds.Contains(x.Session.GroupId.Value)
                    && x.Session.SpringSemester == springSemester
                    && x.Session.WeekNumber == weekNumber);
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

        public IEnumerable<Activity> GetBySessionNumber(int groupId, int sessionCount, bool springSemester, int sessionNumber)
        {
            return _dbSet
                .Include(x => x.Session)
                .Where(x => x.Session.GroupId == groupId
                    && x.Session.SpringSemester == springSemester
                    && x.Session.Number >= sessionNumber
                    && x.Session.Number < sessionNumber + sessionCount);
        }

        public async Task AddActivity(Activity activity)
        {
            await _dbSet.AddAsync(activity);
        }
    }
}
