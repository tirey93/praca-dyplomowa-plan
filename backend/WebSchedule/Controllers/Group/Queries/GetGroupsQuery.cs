using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Group.Queries
{
    public class GetGroupsQuery : IRequest<IEnumerable<GroupInfoResponse>>
    {
        public int? ExceptUserId { get; set; }
    }

    public class GetGroupsQueryHandler : IRequestHandler<GetGroupsQuery, IEnumerable<GroupInfoResponse>>
    {
        private readonly IGroupRepository _groupRepository;

        public GetGroupsQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public Task<IEnumerable<GroupInfoResponse>> Handle(GetGroupsQuery request, CancellationToken cancellationToken)
        {
            var groups = _groupRepository.Get()
                .Where(g => request.ExceptUserId == null 
                    || (!g.Candidates.Any(m => m.Id == request.ExceptUserId) && !g.Members.Any(m => m.Id == request.ExceptUserId)))
                .OrderByDescending(x => x.StartingYear)
                .ThenBy(x => x.StudyMode)
                .ThenBy(x => x.StudyLevel)
                .ThenBy(x => x.StudyCourse.Name)
                .ThenBy(x => x.Subgroup);

            return Task.FromResult(groups.Select(gi => new GroupInfoResponse
            {
                Id = gi.Id,
                StartingYear = gi.StartingYear,
                StudyCourseName = gi.StudyCourse.Name,
                StudyCourseShort = gi.StudyCourse.ShortName,
                StudyLevel = gi.StudyLevel.ToString(),
                StudyMode = gi.StudyMode.ToString(),
                Subgroup = gi.Subgroup,
                MembersCount = gi.MembersCount,
            }));
        }
    }
}
