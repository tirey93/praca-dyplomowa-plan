using MediatR;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Domain.Repositories;
using WebSchedule.Hubs.Dtos;

namespace WebSchedule.Controllers.Message.Queries
{
    public class GetByGroupQuery : IRequest<IEnumerable<MessageDto>>
    {
        public int GroupId { get; set; }
    }

    public class GetByGroupQueryHandler : IRequestHandler<GetByGroupQuery, IEnumerable<MessageDto>>
    {
        private readonly IMessageRepostory _messageRepostory;
        private readonly IGroupRepository _groupRepository;
        private readonly ISessionInGroupRepository _sessionInGroupRepository;

        public GetByGroupQueryHandler(IMessageRepostory messageRepostory, IGroupRepository groupRepository, ISessionInGroupRepository sessionInGroupRepository)
        {
            _messageRepostory = messageRepostory;
            _groupRepository = groupRepository;
            _sessionInGroupRepository = sessionInGroupRepository;
        }

        public Task<IEnumerable<MessageDto>> Handle(GetByGroupQuery request, CancellationToken cancellationToken)
        {
            var res = _sessionInGroupRepository.GetDefaults().ToList();
            if (!_groupRepository.GroupExists(request.GroupId))
            {
                throw new GroupNotFoundException(request.GroupId);
            }

            var messages = _messageRepostory.GetByGroup(request.GroupId);

            return Task.FromResult(messages.Select(message => new MessageDto
            {
                User = new UserDto
                {
                    Id = message.UserInGroup.User.Id,
                    DisplayName = message.UserInGroup.User.DisplayName,
                    Role = message.UserInGroup.UserRole.ToString()
                },
                Content = message.Content,
                GroupId = message.UserInGroup.GroupId,
                CreatedAt = message.CreatedAt
            }));
        }
    }
}
