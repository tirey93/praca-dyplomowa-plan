using MediatR;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Group.Queries
{
    public class GetGroupByIdQuery : IRequest<UserGroupResponse>
    {
        public int GroupId { get; set; }
    }

    public class GetGroupByIdQueryHandler : IRequestHandler<GetGroupByIdQuery, UserGroupResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserInGroupRepository _userInGroupRepository;

        public GetGroupByIdQueryHandler(IUserRepository userRepository, IUserInGroupRepository userInGroupRepository)
        {
            _userRepository = userRepository;
            _userInGroupRepository = userInGroupRepository;
        }

        public Task<UserGroupResponse> Handle(GetGroupByIdQuery request, CancellationToken cancellationToken)
        {
            var userGroup = _userInGroupRepository.Get(request.GroupId)
                ?? throw new GroupNotFoundException(request.GroupId);
            return Task.FromResult(new UserGroupResponse
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
            });
        }
    }
}
