using Microsoft.EntityFrameworkCore;
using WebSchedule.Domain.Dtos;
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Infrastructure.Repositories
{
    public class UserInGroupRepository : Repository<UserInGroup>, IUserInGroupRepository
    {
        public UserInGroupRepository(AppDbContext appDbContext)
            : base(appDbContext, appDbContext.UserInGroups)
        {
        }
        public IEnumerable<UserGroupDto> GetUserGroups(int userId)
        {
            var res = _dbSet
                .Include(g => g.User)
                .Include(g => g.Group).ThenInclude(x => x.StudyCourse)
                .Where(g => g.UserId == userId)
                .ToList();

            return _dbSet
                .Include(g => g.User)
                .Include(g => g.Group).ThenInclude(x => x.StudyCourse)
                .Where(g => g.UserId == userId)
                .Select(x => new UserGroupDto
                {
                    Id = x.GroupId,
                    IsAdmin = x.UserRole == UserRole.Admin,
                    IsCandidate = x.UserRole == UserRole.Candidate,
                    Name = x.Group.Name,
                });
        }
    }
}
