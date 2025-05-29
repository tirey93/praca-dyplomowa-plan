using MediatR;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.UserInGroup.Requests
{
    public class DeleteFromGroupCommand : DeleteFromGroupRequest, IRequest
    {
        public int UserId { get; set; }
    }

    public class DeleteFromGroupCommandHandler : IRequestHandler<DeleteFromGroupCommand>
    {
        private readonly IUserRepository _userRepository;
        private readonly IGroupRepository _groupRepository;
        private readonly IUserInGroupRepository _userInGroupRepository;

        public DeleteFromGroupCommandHandler(
            IUserRepository userRepository, 
            IGroupRepository groupRepository,
            IUserInGroupRepository userInGroupRepository)
        {
            _userRepository = userRepository;
            _groupRepository = groupRepository;
            _userInGroupRepository = userInGroupRepository;
        }

        public async Task Handle(DeleteFromGroupCommand request, CancellationToken cancellationToken)
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
