
using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface ISessionRepository : IRepository<Session>
    {
        Session Get(int groupId, int number, bool springSemester);
        Session Get(int sessionId);
        IEnumerable<Session> GetByGroup(int id);
        Session GetCurrentSession(int groupId, bool springSemester);
        Session GetDefaultCurrentSession(bool springSemester);
        IEnumerable<Session> GetDefaults();
        Session GetFirstSession(bool springSemester);
        Session GetNext(Session session);
        Session GetPrevious(Session session);
    }
}