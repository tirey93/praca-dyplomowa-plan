using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.UserInGroup.Queries
{
    public class GetUserCandidatesQuery : IRequest<IEnumerable<UserGroupResponse>>
    {
        public int UserId { get; set; }
    }

    public class GetUserCandidatesQueryHandler : IRequestHandler<GetUserCandidatesQuery, IEnumerable<UserGroupResponse>>
    {
        private readonly IUserInGroupRepository _userInGroupRepository;

        public GetUserCandidatesQueryHandler(IUserInGroupRepository userInGroupRepository)
        {
            _userInGroupRepository = userInGroupRepository;
        }

        public Task<IEnumerable<UserGroupResponse>> Handle(GetUserCandidatesQuery request, CancellationToken cancellationToken)
        {
            var userGroups = _userInGroupRepository.GetUserGroupsByUser(request.UserId)
                .Where(x => x.IsCandidate);
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
