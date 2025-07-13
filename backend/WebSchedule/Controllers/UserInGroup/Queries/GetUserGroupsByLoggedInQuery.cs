using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.UserInGroup.Queries
{
    public class GetUserGroupsByLoggedInQuery : IRequest<IEnumerable<UserGroupResponse>>
    {
        public int UserId { get; set; }
    }

    public class GetGroupsByLoggedInQueryHandler : IRequestHandler<GetUserGroupsByLoggedInQuery, IEnumerable<UserGroupResponse>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserInGroupRepository _userInGroupRepository;

        public GetGroupsByLoggedInQueryHandler(IUserRepository userRepository, IUserInGroupRepository userInGroupRepository)
        {
            _userRepository = userRepository;
            _userInGroupRepository = userInGroupRepository;
        }

        public Task<IEnumerable<UserGroupResponse>> Handle(GetUserGroupsByLoggedInQuery request, CancellationToken cancellationToken)
        {
            var user = _userRepository.Get(request.UserId)
                    ?? throw new UserNotFoundException(request.UserId.ToString());

            var userGroups = _userInGroupRepository.GetUserGroupsByUser(request.UserId);
            return Task.FromResult(userGroups.Select(userGroup => new UserGroupResponse
            {
                Group = new GroupResponse
                {
                    Id = userGroup.Group.Id,
                    StudyCourseName = userGroup.Group.StudyCourseName,
                    StartingYear = userGroup.Group.StartingYear,
                    StudyCourseShort = userGroup.Group.StudyCourseShort,
                    StudyLevel = userGroup.Group.StudyLevel,
                    StudyMode = userGroup.Group.StudyMode,
                    Subgroup = userGroup.Group.Subgroup,
                },
                User = new UserResponse
                {
                    Id = userGroup.User.Id,
                    Login = userGroup.User.Login,
                    DisplayName = userGroup.User.DisplayName,
                    IsActive = userGroup.User.IsActive
                },
                IsAdmin = userGroup.IsAdmin,
                IsCandidate = userGroup.IsCandidate,
            }));
        }
    }
}
