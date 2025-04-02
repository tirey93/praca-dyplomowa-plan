
using WebSchedule.Domain.Entities;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Infrastructure.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(AppDbContext appDbContext)
            : base(appDbContext, appDbContext.Users)
        {
        }

        public async Task RegisterUserAsync(User user)
        {
            await _dbSet.AddAsync(user);
        }

        public bool UserExists(string userName)
        {
            return _dbSet.Any(x => x.Name == userName);
        }

        public User TryLoginByPassword(string userName, string hashedPassword)
        {
            return _dbSet.FirstOrDefault(x => x.Name == userName && x.HashedPassword.ToLower() == hashedPassword.ToLower());
        }
    }
}
