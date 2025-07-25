﻿using MediatR;
using Microsoft.AspNetCore.SignalR;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Controllers.UserInGroup.Exceptions;
using WebSchedule.Domain.Repositories;
using WebSchedule.Hubs;
using WebSchedule.Hubs.Contracts;
using WebSchedule.Hubs.Dtos;

namespace WebSchedule.Controllers.Message.Commands
{
    public class SendCommand : IRequest
    {
        public int SenderId { get; set; }
        public string Content { get; set; }
        public int GroupId { get; set; }
    }

    public class SendCommandHandler : IRequestHandler<SendCommand>
    {
        private readonly IUserInGroupRepository _userInGroupRepository;
        private readonly IMessageRepostory _messageRepostory;
        private readonly IHubContext<ConversationHub, IMessageClient> _hubContext;

        public SendCommandHandler(
            IUserInGroupRepository userInGroupRepository,
            IMessageRepostory messageRepostory,
            IHubContext<ConversationHub, IMessageClient> hubContext)
        {
            _userInGroupRepository = userInGroupRepository;
            _messageRepostory = messageRepostory;
            _hubContext = hubContext;
        }

        public async Task Handle(SendCommand request, CancellationToken cancellationToken)
        {
            var userGroup = _userInGroupRepository.Get(request.SenderId, request.GroupId)
                ?? throw new UserNotFoundInGroupException(request.SenderId, request.GroupId);

            var message = new Domain.Entities.Message(userGroup, request.Content);
            await _messageRepostory.Add(message);
            await _messageRepostory.SaveChangesAsync();

            await _hubContext.Clients.Group(request.GroupId.ToString()).Receive(new MessageDto
            {
                User = new UserDto
                {
                    Id = userGroup.User.Id,
                    DisplayName = userGroup.User.DisplayName,
                    Role = userGroup.UserRole.ToString()
                },
                Content = request.Content,
                GroupId = request.GroupId,
                CreatedAt = message.CreatedAt,
            });
        }
    }
}
