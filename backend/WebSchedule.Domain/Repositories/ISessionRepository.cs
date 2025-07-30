
using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface ISessionRepository : IRepository<Session>
    {
        Session Get(int groupId, int number, bool springSemester);
        IEnumerable<Session> GetByGroup(int id);
        IEnumerable<Session> GetDefaults();
    }
}