using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface IGroupRepository : IRepository<Group>
    {
        IEnumerable<Group> Get();
        Group Get(int groupId);
        bool GroupExists(int groupId);
    }
}