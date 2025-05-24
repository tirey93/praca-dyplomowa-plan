using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface IGroupRepository : IRepository<Group>
    {
        IEnumerable<Group> Get();
    }
}