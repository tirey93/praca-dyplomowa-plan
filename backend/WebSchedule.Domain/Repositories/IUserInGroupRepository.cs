using WebSchedule.Domain.Dtos;
using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface IUserInGroupRepository : IRepository<UserInGroup>
    {
        UserGroupDto Get(int groupId);
        IEnumerable<UserInGroup> GetAdminsForGroup(int groupId);
        IEnumerable<UserGroupDto> GetUserGroups(int userId);
    }
}