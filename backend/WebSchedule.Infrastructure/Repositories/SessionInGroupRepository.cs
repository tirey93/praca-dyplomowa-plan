using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Infrastructure.Repositories
{
    public class SessionInGroupRepository : Repository<SessionInGroup>, ISessionInGroupRepository
    {
        public SessionInGroupRepository(AppDbContext appDbContext)
            : base(appDbContext, appDbContext.SessionInGroups)
        {
        }

        public IEnumerable<SessionInGroup> GetDefaults()
        {
            return _dbSet.Where(x => x.GroupId == null);
        }

    }
}
