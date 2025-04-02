using Microsoft.EntityFrameworkCore;
using WebSchedule.Domain.Dtos;
using WebSchedule.Domain.Entities;
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Infrastructure.Repositories
{
    public class GroupRepository : Repository<Group>, IGroupRepository
    {
        public GroupRepository(AppDbContext appDbContext)
            : base(appDbContext, appDbContext.Groups)
        {
        }
        public UserGroupDto GetUserGroup(int userId)
        {
            var groups = _dbSet
                .Include(g => g.Users)
                .Where(g => g.Users.Any(u => u.Id == userId));

            //to test
            //todo
            return null;
        }

        public async Task AddGroup(Group group)
        {
            await _dbSet.AddAsync(group);
        }
    }
}
