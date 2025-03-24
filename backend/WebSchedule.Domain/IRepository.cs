namespace WebSchedule.Domain
{
    public interface IRepository<T> where T : Entity
    {
        T Get(int id);
        Task SaveChangesAsync();
    }
}
