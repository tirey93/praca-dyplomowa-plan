using WebSchedule.Domain.Dtos;
using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface IUserInGroupRepository : IRepository<UserInGroup>
    {
        IEnumerable<UserInGroup> GetAdminsForGroup(int groupId);
        IEnumerable<UserGroupDto> GetUserGroupsByGroup(int groupId);
        IEnumerable<UserGroupDto> GetUserGroupsByUser(int userId);
    }
}