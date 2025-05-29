using Microsoft.EntityFrameworkCore;
using WebSchedule.Domain;

namespace WebSchedule.Infrastructure.Repositories
{
    public abstract class Repository<T> : IRepository<T> where T : Entity
    {
        private readonly AppDbContext _appDbContext;
        protected readonly DbSet<T> _dbSet;

        public Repository(AppDbContext appDbContext, DbSet<T> dbSet)
        {
            _appDbContext = appDbContext;
            _dbSet = dbSet;
        }

        public async Task SaveChangesAsync()
        {
            await _appDbContext.SaveChangesAsync();
        }

        public void Remove(T entity)
        {
            _appDbContext.Remove(entity);
        }
    }
}
