
using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface ISessionRepository : IRepository<Session>
    {
        Session Get(int groupId, int number, bool springSemester);
        Session Get(int sessionId);
        IEnumerable<Session> GetByGroup(int id);
        Session GetCurrentSession(int groupId, bool springSemester);
        IEnumerable<Session> GetDefaults();
        Session GetFirstSession(int groupId, bool springSemester);
        Session GetFirstWeekSession(int groupId, bool springSemester);
        Session GetNext(int groupId, int weekNumber);
        Session GetPrevious(Session session);
    }
}