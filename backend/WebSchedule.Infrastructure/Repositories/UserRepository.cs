
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
    }
}
