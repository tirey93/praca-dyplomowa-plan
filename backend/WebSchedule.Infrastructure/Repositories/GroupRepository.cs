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

        public IEnumerable<Group> Get()
        {
            return _dbSet
                .Include(x => x.StudyCourse)
                .Include(x => x.MembersInGroup).ThenInclude(x => x.User);
        }
    }
}
