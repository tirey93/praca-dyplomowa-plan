using System.Globalization;
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
                .Where(x => x.GroupId == groupId && x.SpringSemester == springSemester && x.WeekNumber >= isoWeekNumber)
                .OrderBy(x => x.Number)
                .FirstOrDefault();
        }

        public Session GetDefaultCurrentSession(bool springSemester)
        {
            int isoWeekNumber = ISOWeek.GetWeekOfYear(DateTime.Today);
            return _dbSet
                .Where(x => x.GroupId == null && x.SpringSemester == springSemester && x.WeekNumber >= isoWeekNumber)
                .OrderBy(x => x.Number)
                .FirstOrDefault();
        }

        public Session GetFirstSession(bool springSemester)
        {
            int isoWeekNumber = ISOWeek.GetWeekOfYear(DateTime.Today);
            return _dbSet
                .Where(x => x.GroupId == null && x.SpringSemester == springSemester && x.Number == 1)
                .OrderBy(x => x.Number)
                .FirstOrDefault();
        }
        public IEnumerable<Session> GetDefaults()
        {
            return _dbSet.Where(x => x.GroupId == null);
        }

        public IEnumerable<Session> GetByGroup(int id)
        {
            return _dbSet.Where(x => x.GroupId == id);
        }

        public Session Get(int groupId, int number, bool springSemester)
        {
            return _dbSet.FirstOrDefault(x => x.GroupId == groupId && x.Number == number && x.SpringSemester == springSemester);
        }

        public Session Get(int sessionId)
        {
            return _dbSet.FirstOrDefault(x => x.Id == sessionId);
        }

        public Session GetNext(Session session)
        {
            return _dbSet.FirstOrDefault(x => x.GroupId == session.GroupId && x.SpringSemester == session.SpringSemester && x.Number == session.Number + 1);
        }

        public Session GetPrevious(Session session)
        {
            return _dbSet.FirstOrDefault(x => x.GroupId == session.GroupId && x.SpringSemester == session.SpringSemester && x.Number == session.Number - 1);
        }
    }
}
