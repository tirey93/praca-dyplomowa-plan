using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface IStudyCourseRepository : IRepository<StudyCourse>
    {
        Task AddStudyCourseAsync(StudyCourse studyCourse);
        bool Exists(int id);
        IEnumerable<StudyCourse> Get();
        StudyCourse Get(int id);
        bool IsNameExists(string name);
        bool IsShortNameExists(string shortName);
    }
}