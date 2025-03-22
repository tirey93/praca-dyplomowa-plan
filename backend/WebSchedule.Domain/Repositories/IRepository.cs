using WebSchedule.Domain.Entities;

namespace WebSchedule.Domain.Repositories
{
    public interface IRepository<T> where T : Entity
    {
        T Get(int id);
        Task SaveChangesAsync();
    }
}
