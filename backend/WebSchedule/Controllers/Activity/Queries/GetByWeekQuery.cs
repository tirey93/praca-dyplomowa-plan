using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Activity.Queries
{
    public class GetByWeekQuery : IRequest<IEnumerable<ActivityResponse>>
    {
        public int WeekNumber { get; set; }
        public bool SpringSemester { get; set; }
        public int[] GroupIds { get; set; }
    }

    public class GetByWeekQueryHandler : IRequestHandler<GetByWeekQuery, IEnumerable<ActivityResponse>>
    {
        private readonly IActivityRepository _activityRepository;

        public GetByWeekQueryHandler(IActivityRepository activityRepository)
        {
            _activityRepository = activityRepository;
        }

        public Task<IEnumerable<ActivityResponse>> Handle(GetByWeekQuery request, CancellationToken cancellationToken)
        {
            var activities = _activityRepository.GetActivitiesForWeek(request.GroupIds, request.WeekNumber, request.SpringSemester).OrderBy(x => x.Session.GroupId);
            if (!activities.Any())
            {
                return Task.FromResult(Enumerable.Empty<ActivityResponse>());
            }

            return Task.FromResult(activities.Select(activity => new ActivityResponse
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
            }));
        }
    }
}
