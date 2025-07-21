using WebSchedule.Domain.Entities;

namespace WebSchedule.Domain.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        bool UserExists(string userName);
        Task RegisterUserAsync(User user);
        User TryLoginByPassword(string userName, string hashedPassword);
        User Get(int id);
        bool UserExists(int userId);
        IEnumerable<User> Get();
    }
}
