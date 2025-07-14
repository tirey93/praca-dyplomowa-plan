using MediatR;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Controllers.UserInGroup.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.UserInGroup.Requests
{
    public class ChangeRoleCommand : IRequest
    {
        public int UserId { get; set; }
        public int GroupId { get; set; }
        public string Role { get; set; }
    }

    public class ChangeRoleCommandHandler : IRequestHandler<ChangeRoleCommand>
    {
        private readonly IUserRepository _userRepository;
        private readonly IGroupRepository _groupRepository;
        private readonly IUserInGroupRepository _userInGroupRepository;

        public ChangeRoleCommandHandler(IUserRepository userRepository, IGroupRepository groupRepository, IUserInGroupRepository userInGroupRepository)
        {
            _userRepository = userRepository;
            _groupRepository = groupRepository;
            _userInGroupRepository = userInGroupRepository;
        }

        public async Task Handle(ChangeRoleCommand request, CancellationToken cancellationToken)
        {
            if (!_userRepository.UserExists(request.UserId))
                throw new UserNotFoundException(request.UserId.ToString());
            if (!_groupRepository.GroupExists(request.GroupId))
                throw new GroupNotFoundException(request.GroupId);

            if (Enum.TryParse<Domain.Entities.Study.UserRole>(request.Role, out var role))
            {
                var userInGroup = _userInGroupRepository.Get(request.UserId, request.GroupId)
                    ?? throw new UserNotFoundInGroupException(request.UserId, request.GroupId);
                userInGroup.ChangeRole(role);
                await _userInGroupRepository.SaveChangesAsync();
            }
            else
            {
                throw new RoleNotFoundException(request.Role);
            }
        }
    }
}
