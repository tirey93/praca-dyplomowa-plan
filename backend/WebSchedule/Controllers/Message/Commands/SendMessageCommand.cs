using MediatR;
using Microsoft.AspNetCore.SignalR;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain.Repositories;
using WebSchedule.Hubs;
using WebSchedule.Hubs.Contracts;
using WebSchedule.Hubs.Dtos;

namespace WebSchedule.Controllers.Message.Commands
{
    public class SendMessageCommand : IRequest
    {
        public int SenderId { get; set; }
        public string Content { get; set; }
        public int GroupId { get; set; }
    }

    public class SendMessageCommandHandler : IRequestHandler<SendMessageCommand>
    {
        private readonly IUserRepository _userRepository;
        private readonly IHubContext<MessageHub, IMessageClient> _hubContext;

        public SendMessageCommandHandler(IUserRepository userRepository, IHubContext<MessageHub, IMessageClient> hubContext)
        {
            _userRepository = userRepository;
            _hubContext = hubContext;
        }

        public async Task Handle(SendMessageCommand request, CancellationToken cancellationToken)
        {
            await _hubContext.Clients.Group(request.GroupId.ToString()).Receive(new MessageDto
           {
               Content = request.Content,
               GroupId = request.GroupId
           });

        }
    }
}
