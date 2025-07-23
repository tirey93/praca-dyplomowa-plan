
using Microsoft.EntityFrameworkCore;
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

        public IEnumerable<Message> GetByGroup(int groupId)
        {
            return _dbSet
                .Include(x => x.UserInGroup).ThenInclude(x => x.User)
                .Where(x => x.UserInGroup.GroupId == groupId)
                .OrderByDescending(x => x.CreatedAt)
                .Take(50);
        }
    }
}
