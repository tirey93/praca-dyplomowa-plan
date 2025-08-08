using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Activity.Queries
{
    public class GetByCurrentDateQuery : IRequest<IOrderedEnumerable<ActivityInSessionResponse>>
    {
        public int GroupId { get; set; }
        public bool SpringSemester { get; set; }
        public int SessionCount { get; set; }
    }

    public class GetByCurrentDateQueryHandler : IRequestHandler<GetByCurrentDateQuery, IOrderedEnumerable<ActivityInSessionResponse>>
    {
        private readonly IActivityRepository _activityRepository;
        private readonly ISessionRepository _sessionRepository;

        public GetByCurrentDateQueryHandler(IActivityRepository activityRepository, ISessionRepository sessionRepository)
        {
            _activityRepository = activityRepository;
            _sessionRepository = sessionRepository;
        }

        public Task<IOrderedEnumerable<ActivityInSessionResponse>> Handle(GetByCurrentDateQuery request, CancellationToken cancellationToken)
        {
            var currentSession = _sessionRepository.GetCurrentSession(request.GroupId, request.SpringSemester);
            var groupedActivities = _activityRepository
                .GetBySessionNumber(request.GroupId, request.SessionCount, request.SpringSemester, currentSession.Number)
                .GroupBy(x => x.Session.Number);

            var result = groupedActivities.Select(groupedActivity => new ActivityInSessionResponse
            {
                SessionNumber = groupedActivity.Key,
                Activities = groupedActivity.Select(activity => new ActivityResponse
                {
                    ActivityId = activity.Id,
                    Name = activity.Name,
                    TeacherFullName = activity.TeacherFullName,
                    Location = activity.Location,
                    StartingHour = activity.StartingHour,
                    Duration = activity.Duration,
                    WeekDay = activity.WeekDay.ToString(),
                    Session = new SessionResponse
                    {
                        SessionId = activity.SessionId,
                        GroupId = activity.Session.GroupId,
                        Number = activity.Session.Number,
                        WeekNumber = activity.Session.WeekNumber,
                        SpringSemester = activity.Session.SpringSemester
                    }
                }).OrderBy(x => x.WeekDay).ThenBy(x => x.StartingHour)
            }).OrderBy(x => x.SessionNumber);
            return Task.FromResult(result);
        }
    }
}
