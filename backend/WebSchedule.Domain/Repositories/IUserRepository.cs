
using WebSchedule.Domain.Entities;

namespace WebSchedule.Domain.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<bool> UserExistsAsync(string userName);
        Task RegisterUserAsync(User user);
    }
}
