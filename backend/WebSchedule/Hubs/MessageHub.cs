using MediatR;
using Microsoft.AspNetCore.SignalR;
using WebSchedule.Hubs.Contracts;

namespace WebSchedule.Hubs
{
    public class MessageHub : Hub<IMessageClient>
    {
        private readonly IMediator _mediator;

        public MessageHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task JoinGroup(int groupId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupId.ToString());
        }

        public async Task LeaveGroup(int groupId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId.ToString());
        }
    }
}
