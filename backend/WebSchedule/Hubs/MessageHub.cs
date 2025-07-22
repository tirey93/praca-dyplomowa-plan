using MediatR;
using Microsoft.AspNetCore.SignalR;
using WebSchedule.Controllers.User.Commands;
using WebSchedule.Hubs.Contracts;
using WebSchedule.Hubs.Dtos;

namespace WebSchedule.Hubs
{
    public class MessageHub : Hub<IMessageClient>
    {
        private readonly IMediator _mediator;

        public MessageHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendEcho(MessageDto testDto)
        {
            await _mediator.Send(new UpdateUserDisplayNameCommand
            {
                DisplayName = testDto.Message,
                UserId = testDto.Prop
            });
            await Clients.All.Echo($"{testDto.Message} {testDto.Prop}");
        }
    }
}
