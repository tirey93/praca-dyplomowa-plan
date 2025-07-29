
using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface ISessionInGroupRepository : IRepository<SessionInGroup>
    {
        IEnumerable<SessionInGroup> GetByGroup(int id);
        IEnumerable<SessionInGroup> GetDefaults();
    }
}