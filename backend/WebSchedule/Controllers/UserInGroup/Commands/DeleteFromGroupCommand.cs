using MediatR;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.UserInGroup.Requests
{
    public class DisenrollFromGroupCommand : DisenrollFromGroupRequest, IRequest
    {
        public int UserId { get; set; }
    }

    public class DisenrollFromGroupCommandHandler : IRequestHandler<DisenrollFromGroupCommand>
    {
        private readonly IUserRepository _userRepository;
        private readonly IGroupRepository _groupRepository;
        private readonly IUserInGroupRepository _userInGroupRepository;

        public DisenrollFromGroupCommandHandler(
            IUserRepository userRepository, 
            IGroupRepository groupRepository,
            IUserInGroupRepository userInGroupRepository)
        {
            _userRepository = userRepository;
            _groupRepository = groupRepository;
            _userInGroupRepository = userInGroupRepository;
        }

        public async Task Handle(DisenrollFromGroupCommand request, CancellationToken cancellationToken)
        {
            if (!_userRepository.UserExists(request.UserId))
                throw new UserNotFoundException(request.UserId.ToString());
            if (!_groupRepository.GroupExists(request.GroupId))
                throw new GroupNotFoundException(request.GroupId);

            var group = _groupRepository.Get(request.GroupId);
            var user = _userRepository.Get(request.UserId);

            group.RemoveMember(user);

            await _groupRepository.SaveChangesAsync();
        }
    }
}
