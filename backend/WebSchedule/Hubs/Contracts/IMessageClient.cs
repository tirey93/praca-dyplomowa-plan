namespace WebSchedule.Hubs.Contracts
{
    public interface IMessageClient
    {
        Task Echo(string message);
    }
}
