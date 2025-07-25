using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.UserInGroup.Queries
{
    public class GetGroupCandidatesQuery : IRequest<IEnumerable<UserGroupResponse>>
    {
        public int GroupId { get; set; }
    }

    public class GetGroupCandidatesQueryHandler : IRequestHandler<GetGroupCandidatesQuery, IEnumerable<UserGroupResponse>>
    {
        private readonly IUserInGroupRepository _userInGroupRepository;

        public GetGroupCandidatesQueryHandler(IUserInGroupRepository userInGroupRepository)
        {
            _userInGroupRepository = userInGroupRepository;
        }

        public Task<IEnumerable<UserGroupResponse>> Handle(GetGroupCandidatesQuery request, CancellationToken cancellationToken)
        {
            var userGroups = _userInGroupRepository.GetUserGroupsByGroup(request.GroupId)
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
