
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

        public async Task RegisterUserAsync(User user)
        {
            await _dbSet.AddAsync(user);
        }

        public async Task<bool> UserExistsAsync(string userName)
        {
            return await _dbSet.AnyAsync(x => x.Name == userName);
        }

        public async Task<User> TryLoginByPassword(string userName, string hashedPassword)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Name == userName && x.HashedPassword.ToLower() == hashedPassword.ToLower());
        }
    }
}
