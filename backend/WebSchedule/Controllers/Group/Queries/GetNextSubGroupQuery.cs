using MediatR;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Group.Queries
{
    public class GetNextSubGroupQuery : IRequest<int>
    {
        public int Year { get; set; }
        public string StudyLevel { get; set; }
        public int CourseId { get; set; }
    }

    public class GetNextSubGroupQueryHandler : IRequestHandler<GetNextSubGroupQuery, int>
    {
        private readonly IGroupRepository _groupRepository;

        public GetNextSubGroupQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public Task<int> Handle(GetNextSubGroupQuery request, CancellationToken cancellationToken)
        {
            var subgroup = _groupRepository.GetNextSubgroup(
                request.Year, 
                Enum.Parse<StudyLevel>(request.StudyLevel), 
                request.CourseId);
            return Task.FromResult((subgroup ?? 0) + 1);
        }
    }
}
