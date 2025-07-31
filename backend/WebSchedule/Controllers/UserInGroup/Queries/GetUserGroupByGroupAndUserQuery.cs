using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.UserInGroup.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.UserInGroup.Queries
{
    public class GetUserGroupByGroupAndUserQuery : IRequest<UserGroupResponse>
    {
        public int GroupId { get; set; }
        public int UserId { get; set; }
    }

    public class GetGroupByIdQueryHandler : IRequestHandler<GetUserGroupByGroupAndUserQuery, UserGroupResponse>
    {
        private readonly IUserInGroupRepository _userInGroupRepository;

        public GetGroupByIdQueryHandler(IUserInGroupRepository userInGroupRepository)
        {
            _userInGroupRepository = userInGroupRepository;
        }

        public Task<UserGroupResponse> Handle(GetUserGroupByGroupAndUserQuery request, CancellationToken cancellationToken)
        {
            var userGroup = _userInGroupRepository.GetUserGroupsByUser(request.UserId).FirstOrDefault(x => x.Group.Id == request.GroupId)
                ?? throw new UserInGroupNotFoundException(request.UserId, request.GroupId);
            return Task.FromResult(new UserGroupResponse
            {
                Group = new GroupResponse
                {
                    Id = userGroup.Group.Id,
                    StudyCourseName = userGroup.Group.StudyCourseName,
                    StartingYear = userGroup.Group.StartingYear,
                    StudyCourseShort = userGroup.Group.StudyCourseShort,
                    StudyLevel = userGroup.Group.StudyLevel,
                    Subgroup = userGroup.Group.Subgroup,
                    SpringSemester = userGroup.Group.SpringSemester,
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
            });
        }
    }
}
