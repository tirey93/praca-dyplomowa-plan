using WebSchedule.Domain.Dtos;
using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface IUserInGroupRepository : IRepository<UserInGroup>
    {
        IEnumerable<UserGroupDto> GetUserGroups(int userId);
    }
}