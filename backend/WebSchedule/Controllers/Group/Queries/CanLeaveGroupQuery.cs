using MediatR;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Group.Queries
{
    public class CanLeaveGroupQuery : IRequest<bool>
    {
        public int UserId { get; set; }
        public int GroupId { get; set; }
    }

    public class CanLeaveGroupQueryHandler : IRequestHandler<CanLeaveGroupQuery, bool>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserInGroupRepository _userInGroupRepository;

        public CanLeaveGroupQueryHandler(IUserRepository userRepository, IUserInGroupRepository userInGroupRepository)
        {
            _userRepository = userRepository;
            _userInGroupRepository = userInGroupRepository;
        }

        public Task<bool> Handle(CanLeaveGroupQuery request, CancellationToken cancellationToken)
        {
            var user = _userRepository.Get(request.UserId)
                    ?? throw new UserNotFoundException(request.UserId.ToString());

            var adminUserGroups = _userInGroupRepository.GetAdminsForGroup(request.GroupId);

            return Task.FromResult(adminUserGroups.Any(x => x.UserId != request.UserId));
        }
    }
}
