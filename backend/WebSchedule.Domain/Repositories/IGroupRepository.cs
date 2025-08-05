using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface IGroupRepository : IRepository<Group>
    {
        Task AddGroup(Group group);
        IEnumerable<Group> Get();
        Group Get(int groupId);
        IEnumerable<Group> Get(int[] groupIds);
        int? GetNextSubgroup(int year, StudyLevel studyLevel, int courseId);
        bool GroupExists(int groupId);
        bool GroupExists(int year, int subgroup, StudyLevel studyLevel, int courseId);
    }
}