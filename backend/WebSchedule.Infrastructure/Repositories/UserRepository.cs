
using Microsoft.EntityFrameworkCore;
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

        public User Get(int id)
        {
            return _dbSet
                .Where(x => x.Id == id)
                .FirstOrDefault();
        }
        public async Task RegisterUserAsync(User user)
        {
            await _dbSet.AddAsync(user);
        }

        public bool UserExists(string userName)
        {
            return _dbSet.Any(x => x.Login == userName);
        }

        public bool UserExists(int userId)
        {
            return _dbSet.Any(x => x.Id == userId);
        }

        public User TryLoginByPassword(string userName, string hashedPassword)
        {
            return _dbSet.FirstOrDefault(x => x.Login == userName && x.HashedPassword.ToLower() == hashedPassword.ToLower());
        }
    }
}
