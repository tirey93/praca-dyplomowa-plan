using WebSchedule.Domain.Dtos;
using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface IGroupRepository : IRepository<Group>
    {
        UserGroupDto GetUserGroup(int userId);
    }
}
