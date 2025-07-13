using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.UserInGroup.Queries
{
    public class GetUserGroupsByGroupQuery : IRequest<IEnumerable<UserGroupResponse>>
    {
        public int GroupId { get; set; }
        public int? ExceptUserId { get; set; }
    }

    public class GetUserGroupsByGroupQueryHandler : IRequestHandler<GetUserGroupsByGroupQuery, IEnumerable<UserGroupResponse>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserInGroupRepository _userInGroupRepository;

        public GetUserGroupsByGroupQueryHandler(IUserRepository userRepository, IUserInGroupRepository userInGroupRepository)
        {
            _userRepository = userRepository;
            _userInGroupRepository = userInGroupRepository;
        }

        public Task<IEnumerable<UserGroupResponse>> Handle(GetUserGroupsByGroupQuery request, CancellationToken cancellationToken)
        {
            var userGroups = _userInGroupRepository.GetUserGroupsByGroup(request.GroupId);
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
