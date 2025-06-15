using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface IGroupRepository : IRepository<Group>
    {
        Task AddGroup(Group group);
        IEnumerable<Group> Get();
        Group Get(int groupId);
        int? GetNextSubgroup(int year, StudyMode studyMode, StudyLevel studyLevel, int courseId);
        bool GroupExists(int groupId);
        bool GroupExists(int year, int subgroup, StudyMode studyMode, StudyLevel studyLevel, int courseId);
    }
}