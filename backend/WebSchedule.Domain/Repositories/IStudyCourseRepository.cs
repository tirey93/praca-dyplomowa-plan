using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface IStudyCourseRepository : IRepository<StudyCourse>
    {
        IEnumerable<StudyCourse> Get();
    }
}