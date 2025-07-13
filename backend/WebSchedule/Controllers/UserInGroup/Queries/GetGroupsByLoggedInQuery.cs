using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.UserInGroup.Queries
{
    public class GetGroupsByLoggedInQuery : IRequest<IEnumerable<UserGroupResponse>>
    {
        public int UserId { get; set; }
    }

    public class GetGroupsByLoggedInQueryHandler : IRequestHandler<GetGroupsByLoggedInQuery, IEnumerable<UserGroupResponse>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserInGroupRepository _userInGroupRepository;

        public GetGroupsByLoggedInQueryHandler(IUserRepository userRepository, IUserInGroupRepository userInGroupRepository)
        {
            _userRepository = userRepository;
            _userInGroupRepository = userInGroupRepository;
        }

        public Task<IEnumerable<UserGroupResponse>> Handle(GetGroupsByLoggedInQuery request, CancellationToken cancellationToken)
        {
            var user = _userRepository.Get(request.UserId)
                    ?? throw new UserNotFoundException(request.UserId.ToString());

            var userGroups = _userInGroupRepository.GetUserGroups(request.UserId);
            return Task.FromResult(userGroups.Select(x => new UserGroupResponse
            {
                Id = x.Id,
                StudyCourseName = x.StudyCourseName,
                IsAdmin = x.IsAdmin,
                IsCandidate = x.IsCandidate,
                StartingYear = x.StartingYear,
                StudyCourseShort = x.StudyCourseShort,
                StudyLevel = x.StudyLevel,
                StudyMode = x.StudyMode,
                Subgroup = x.Subgroup,
            }));
        }
    }
}
