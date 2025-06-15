using Microsoft.EntityFrameworkCore;
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Infrastructure.Repositories
{
    public class GroupRepository : Repository<Group>, IGroupRepository
    {
        public GroupRepository(AppDbContext appDbContext)
            : base(appDbContext, appDbContext.Groups)
        {
        }

        public async Task AddGroup(Group group)
        {
            await _dbSet.AddAsync(group);
        }

        public bool GroupExists(int groupId)
        {
            return _dbSet.Any(x => x.Id == groupId);
        }

        public bool GroupExists(int year, int subgroup, StudyMode studyMode, StudyLevel studyLevel, int courseId)
        {
            return _dbSet
                .Include(x => x.StudyCourse)
                .Any(x => x.StartingYear == year 
                    && x.Subgroup == subgroup 
                    && x.StudyMode == studyMode 
                    && x.StudyLevel == studyLevel
                    && x.StudyCourse.Id == courseId);
        }

        public IEnumerable<Group> Get()
        {
            return _dbSet
                .Include(x => x.StudyCourse)
                .Include(x => x.MembersInGroup).ThenInclude(x => x.User);
        }

        public Group Get(int groupId)
        {
            return _dbSet
                .Include(x => x.StudyCourse)
                .Include(x => x.MembersInGroup).ThenInclude(x => x.User)
                .FirstOrDefault(x => x.Id == groupId);
        }

        public int? GetNextSubgroup(int year, StudyMode studyMode, StudyLevel studyLevel, int courseId)
        {
            var group = _dbSet
                .Include(x => x.StudyCourse)
                .Where(x => x.StartingYear == year && x.StudyCourse.Id == courseId && x.StudyMode == studyMode && x.StudyLevel == studyLevel)
                .OrderByDescending(x => x.Subgroup)
                .FirstOrDefault();
            return group?.Subgroup;
        }
    }
}
