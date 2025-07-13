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
                Id = userGroup.Id,
                StudyCourseName = userGroup.StudyCourseName,
                IsAdmin = userGroup.IsAdmin,
                IsCandidate = userGroup.IsCandidate,
                StartingYear = userGroup.StartingYear,
                StudyCourseShort = userGroup.StudyCourseShort,
                StudyLevel = userGroup.StudyLevel,
                StudyMode = userGroup.StudyMode,
                Subgroup = userGroup.Subgroup,
            }));
        }
    }
}
