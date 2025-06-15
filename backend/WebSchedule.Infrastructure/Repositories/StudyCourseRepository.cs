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

        public StudyCourse Get(int id)
        {
            return _dbSet.FirstOrDefault(x => x.Id == id);
        }

        public bool Exists(int id)
        {
            return _dbSet.Any(x => x.Id == id);
        }

        public bool IsNameExists(string name)
        {
            return _dbSet.Any(x => x.Name == name);
        }

        public bool IsShortNameExists(string shortName)
        {
            return _dbSet.Any(x => x.ShortName == shortName);
        }

        public async Task AddStudyCourseAsync(StudyCourse studyCourse)
        {
            await _dbSet.AddAsync(studyCourse);
        }
    }
}
