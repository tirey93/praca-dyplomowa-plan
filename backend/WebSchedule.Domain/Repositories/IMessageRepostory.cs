
using WebSchedule.Domain.Entities;

namespace WebSchedule.Domain.Repositories
{
    public interface IMessageRepostory : IRepository<Message>
    {
        Task Add(Message message);
    }
}
