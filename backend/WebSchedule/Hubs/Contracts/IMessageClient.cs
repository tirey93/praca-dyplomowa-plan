using WebSchedule.Hubs.Dtos;

namespace WebSchedule.Hubs.Contracts
{
    public interface IMessageClient
    {
        Task Receive(MessageDto messageDto);
    }
}
