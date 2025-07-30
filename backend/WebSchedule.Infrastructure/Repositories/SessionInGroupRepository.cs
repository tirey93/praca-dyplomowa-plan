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

        public IEnumerable<SessionInGroup> GetByGroup(int id)
        {
            return _dbSet.Where(x => x.GroupId == id);
        }

        public SessionInGroup Get(int groupId, int number, bool springSemester)
        {
            return _dbSet.FirstOrDefault(x => x.GroupId == groupId && x.Number == number && x.SpringSemester == springSemester);
        }
    }
}
