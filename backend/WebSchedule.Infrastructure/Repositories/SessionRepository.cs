using Microsoft.EntityFrameworkCore;
using System.Globalization;
using WebSchedule.Domain.Entities;
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Infrastructure.Repositories
{
    public class SessionRepository : Repository<Session>, ISessionRepository
    {
        public SessionRepository(AppDbContext appDbContext)
            : base(appDbContext, appDbContext.Sessions)
        {
        }

        public Session GetCurrentSession(int groupId, bool springSemester)
        {
            int isoWeekNumber = ISOWeek.GetWeekOfYear(DateTime.Today);
            return _dbSet
                .Include(x => x.Group).ThenInclude(x => x.StudyCourse)
                .Where(x => x.GroupId == groupId && x.SpringSemester == springSemester && x.WeekNumber >= isoWeekNumber)
                .OrderBy(x => x.Number)
                .FirstOrDefault();
        }

        public Session GetFirstSession(int groupId, bool springSemester)
        {
            int isoWeekNumber = ISOWeek.GetWeekOfYear(DateTime.Today);
            return _dbSet
                .Where(x => x.GroupId == groupId && x.SpringSemester == springSemester && x.Number == 1)
                .OrderBy(x => x.Number)
                .FirstOrDefault();
        }

        public Session GetLastSession(int groupId, bool springSemester)
        {
            int isoWeekNumber = ISOWeek.GetWeekOfYear(DateTime.Today);
            return _dbSet
                .Where(x => x.GroupId == groupId && x.SpringSemester == springSemester && x.Number == 10)
                .OrderBy(x => x.Number)
                .FirstOrDefault();
        }

        public Session GetFirstWeekSession(int groupId, bool springSemester)
        {
            return _dbSet
                .Where(x => x.GroupId == groupId && x.SpringSemester == springSemester)
                .OrderBy(x => x.WeekNumber)
                .FirstOrDefault();
        }

        public IEnumerable<Session> GetDefaults()
        {
            return _dbSet.Where(x => x.GroupId == null);
        }

        public IEnumerable<Session> GetByGroup(int id)
        {
            return _dbSet
                .Where(x => x.GroupId == id);
        }

        public Session Get(int groupId, int number, bool springSemester)
        {
            return _dbSet
                .FirstOrDefault(x => x.GroupId == groupId && x.Number == number && x.SpringSemester == springSemester);
        }

        public Session Get(int sessionId)
        {
            return _dbSet
                .FirstOrDefault(x => x.Id == sessionId);
        }

        public Session GetNext(int groupId, bool springSemester, int sessionNumber,  int weekNumber)
        {
            return _dbSet
                .Include(x => x.Group)
                .Where(x => x.GroupId == groupId && x.SpringSemester == springSemester && x.Number == sessionNumber && x.WeekNumber > weekNumber)
                .OrderBy(x => x.Number)
                .FirstOrDefault();
        }

        public bool IsLastWeekInGroup(int groupId, int weekNumber)
        {
            return !_dbSet
                .Include(x => x.Group)
                .Where(x => x.GroupId == groupId && !x.SpringSemester && x.WeekNumber > weekNumber)
                .Any();
        }

        public bool IsFirstWeekInGroup(int groupId, int weekNumber)
        {
            return !_dbSet
                .Include(x => x.Group)
                .Where(x => x.GroupId == groupId && !x.SpringSemester && x.WeekNumber < weekNumber)
                .Any();
        }

        public Session GetPrevious(int groupId, bool springSemester, int sessionNumber, int weekNumber)
        {
            return _dbSet
                .Include(x => x.Group)
                .Where(x => x.GroupId == groupId && x.SpringSemester == springSemester && x.Number == sessionNumber && x.WeekNumber < weekNumber)
                .OrderByDescending(x => x.Number)
                .FirstOrDefault();
        }
    }
}
