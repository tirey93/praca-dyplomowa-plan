using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface IStudyCourseRepository : IRepository<StudyCourse>
    {
        Task AddStudyCourseAsync(StudyCourse studyCourse);
        IEnumerable<StudyCourse> Get();
        bool IsNameExists(string name);
        bool IsShortNameExists(string shortName);
    }
}