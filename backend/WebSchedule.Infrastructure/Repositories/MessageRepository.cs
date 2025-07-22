
using WebSchedule.Domain.Entities;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Infrastructure.Repositories
{
    internal class MessageRepository : Repository<Message>, IMessageRepostory
    {
        public MessageRepository(AppDbContext appDbContext) : base(appDbContext, appDbContext.Messages)
        {
        }

        public async Task Add(Message message)
        {
            await _dbSet.AddAsync(message);
        }
    }
}
