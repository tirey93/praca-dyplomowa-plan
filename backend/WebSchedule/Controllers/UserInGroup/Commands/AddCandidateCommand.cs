using MediatR;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.UserInGroup.Requests
{
    public class AddCandidateCommand : AddCandidateRequest, IRequest
    {
        public int UserId { get; set; }
    }

    public class AddCandidateCommandHandler : IRequestHandler<AddCandidateCommand>
    {
        private readonly IUserRepository _userRepository;
        private readonly IGroupRepository _groupRepository;

        public AddCandidateCommandHandler(IUserRepository userRepository, IGroupRepository groupRepository)
        {
            _userRepository = userRepository;
            _groupRepository = groupRepository;
        }

        public async Task Handle(AddCandidateCommand request, CancellationToken cancellationToken)
        {
            if (!_userRepository.UserExists(request.UserId))
                throw new UserNotFoundException(request.UserId.ToString());
            if (!_groupRepository.GroupExists(request.GroupId))
                throw new GroupNotFoundException(request.GroupId);

            var group = _groupRepository.Get(request.GroupId);
            var user = _userRepository.Get(request.UserId);
            group.AddCandidate(user);

            await _groupRepository.SaveChangesAsync();
        }
    }
}
