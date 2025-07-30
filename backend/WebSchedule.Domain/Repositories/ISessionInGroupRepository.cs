
using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface ISessionInGroupRepository : IRepository<SessionInGroup>
    {
        SessionInGroup Get(int groupId, int number, bool springSemester);
        IEnumerable<SessionInGroup> GetByGroup(int id);
        IEnumerable<SessionInGroup> GetDefaults();
    }
}