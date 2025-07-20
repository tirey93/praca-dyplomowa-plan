using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.UserInGroup.Queries
{
    public class GetUserGroupsByUserQuery : IRequest<IEnumerable<UserGroupResponse>>
    {
        public int UserId { get; set; }
    }

    public class GetUserGroupsByUserQueryHandler : IRequestHandler<GetUserGroupsByUserQuery, IEnumerable<UserGroupResponse>>
    {
        private readonly IUserInGroupRepository _userInGroupRepository;

        public GetUserGroupsByUserQueryHandler(IUserRepository userRepository, IUserInGroupRepository userInGroupRepository)
        {
            _userInGroupRepository = userInGroupRepository;
        }

        public Task<IEnumerable<UserGroupResponse>> Handle(GetUserGroupsByUserQuery request, CancellationToken cancellationToken)
        {
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
