using Microsoft.EntityFrameworkCore;
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

        public async Task AddGroup(Group group)
        {
            await _dbSet.AddAsync(group);
        }

        public bool GroupExists(int groupId)
        {
            return _dbSet.Any(x => x.Id == groupId);
        }

        public IEnumerable<Group> Get()
        {
            return _dbSet
                .Include(x => x.StudyCourse)
                .Include(x => x.MembersInGroup).ThenInclude(x => x.User);
        }

        public Group Get(int groupId)
        {
            return _dbSet
                .Include(x => x.StudyCourse)
                .Include(x => x.MembersInGroup).ThenInclude(x => x.User)
                .FirstOrDefault(x => x.Id == groupId);
        }
    }
}
