using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Infrastructure.Repositories
{
    public class StudyCourseRepository : Repository<StudyCourse>, IStudyCourseRepository
    {
        public StudyCourseRepository(AppDbContext appDbContext)
            : base(appDbContext, appDbContext.StudyCourses)
        {
        }

        public IEnumerable<StudyCourse> Get()
        {
            return _dbSet;
        }
    }
}
