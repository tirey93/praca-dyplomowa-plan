using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Group.Queries
{
    public class GetGroupsByIdQuery : IRequest<IEnumerable<GroupInfoResponse>>
    {
        public int[] GroupIds { get; set; }
    }

    public class GetGroupsByIdQueryHandler : IRequestHandler<GetGroupsByIdQuery, IEnumerable<GroupInfoResponse>>
    {
        private readonly IGroupRepository _groupRepository;

        public GetGroupsByIdQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public Task<IEnumerable<GroupInfoResponse>> Handle(GetGroupsByIdQuery request, CancellationToken cancellationToken)
        {
            var groups = _groupRepository.Get(request.GroupIds);

            return Task.FromResult(groups.Select(gi => new GroupInfoResponse
            {
                Id = gi.Id,
                StartingYear = gi.StartingYear,
                StudyCourseName = gi.StudyCourse.Name,
                StudyCourseShort = gi.StudyCourse.ShortName,
                StudyLevel = gi.StudyLevel.ToString(),
                Subgroup = gi.Subgroup,
                MembersCount = gi.MembersCount,
                SpringSemester = gi.SpringSemester,
            }));
        }
    }
}
