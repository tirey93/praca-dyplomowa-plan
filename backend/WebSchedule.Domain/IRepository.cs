namespace WebSchedule.Domain
{
    public interface IRepository<T> where T : Entity
    {
        Task SaveChangesAsync();
        void Remove(T entity);
    }
}
