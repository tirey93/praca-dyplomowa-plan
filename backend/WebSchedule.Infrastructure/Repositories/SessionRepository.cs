using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Infrastructure.Repositories
{
    public class SessionRepository : Repository<Session>, ISessionRepository
    {
        public SessionRepository(AppDbContext appDbContext)
            : base(appDbContext, appDbContext.Sessions)
        {
        }

        public IEnumerable<Session> GetDefaults()
        {
            return _dbSet.Where(x => x.GroupId == null);
        }

        public IEnumerable<Session> GetByGroup(int id)
        {
            return _dbSet.Where(x => x.GroupId == id);
        }

        public Session Get(int groupId, int number, bool springSemester)
        {
            return _dbSet.FirstOrDefault(x => x.GroupId == groupId && x.Number == number && x.SpringSemester == springSemester);
        }
    }
}
