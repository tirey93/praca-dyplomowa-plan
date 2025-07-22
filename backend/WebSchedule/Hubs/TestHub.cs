using MediatR;
using Microsoft.AspNetCore.SignalR;
using WebSchedule.Controllers.User.Commands;
using WebSchedule.Hubs.Contracts;

namespace WebSchedule.Hubs
{
    public class TestHub : Hub<IEcho>
    {
        private readonly IMediator _mediator;

        public TestHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendEcho(string echo)
        {
            await _mediator.Send(new UpdateUserDisplayNameCommand
            {
                DisplayName = echo,
                UserId = 1
            });
            await Clients.All.Echo(echo);
        }
    }
}
