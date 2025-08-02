using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Activity.Queries
{
    public class GetConflictsQuery : IRequest<IEnumerable<ActivityResponse>>
    {
        public int SessionId { get; set; }
        public int StartingHour { get; set; }
        public int Duration { get; set; }
    }

    public class GetConflictsQueryHandler : IRequestHandler<GetConflictsQuery, IEnumerable<ActivityResponse>>
    {
        private readonly IActivityRepository _activityRepository;

        public GetConflictsQueryHandler(IActivityRepository activityRepository)
        {
            _activityRepository = activityRepository;
        }

        public Task<IEnumerable<ActivityResponse>> Handle(GetConflictsQuery request, CancellationToken cancellationToken)
        {
            var sessions = _sessionRepository.GetDefaults().OrderBy(x => x.SpringSemester).ThenBy(x => x.Number);
            return Task.FromResult(sessions.Select(session => new SessionInGroupResponse
            {
                GroupId = session.GroupId,
                Number = session.Number,
                WeekNumber = session.WeekNumber,
                SpringSemester = session.SpringSemester,
            }));
        }
    }
}
