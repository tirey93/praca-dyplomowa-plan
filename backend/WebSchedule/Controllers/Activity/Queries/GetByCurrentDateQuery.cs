using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Activity.Queries
{
    public class GetByCurrentDateQuery : IRequest<IEnumerable<ActivityResponse>>
    {
        public int GroupId { get; set; }
        public bool SpringSemester { get; set; }
        public int SessionCount { get; set; }
    }

    public class GetByCurrentDateQueryHandler : IRequestHandler<GetByCurrentDateQuery, IEnumerable<ActivityResponse>>
    {
        private readonly IActivityRepository _activityRepository;
        private readonly ISessionRepository _sessionRepository;

        public GetByCurrentDateQueryHandler(IActivityRepository activityRepository, ISessionRepository sessionRepository)
        {
            _activityRepository = activityRepository;
            _sessionRepository = sessionRepository;
        }

        public Task<IEnumerable<ActivityResponse>> Handle(GetByCurrentDateQuery request, CancellationToken cancellationToken)
        {
            var currentSession = _sessionRepository.GetCurrentSession(request.GroupId, request.SpringSemester);
            var activities = _activityRepository.GetBySessionNumber(request.GroupId, request.SessionCount, request.SpringSemester, currentSession.Number);
            return Task.FromResult(activities.Select(activity => new ActivityResponse
            {
                ActivityId = activity.Id,
                Name = activity.Name,
                TeacherFullName = activity.TeacherFullName,
                StartingHour = activity.StartingHour,
                Duration = activity.Duration,
                WeekDay = activity.WeekDay.ToString(),
                Session = new SessionInGroupResponse
                {
                    GroupId = activity.Session.GroupId,
                    Number = activity.Session.Number,
                    WeekNumber = activity.Session.WeekNumber,
                    SpringSemester = activity.Session.SpringSemester
                }
            }));
        }
    }
}
