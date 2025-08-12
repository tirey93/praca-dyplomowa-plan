using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Activity.Queries
{
    public class GetConflictsQuery : IRequest<IEnumerable<ActivityResponse>>
    {
        public int GroupId { get; set; }
        public int[] SessionNumbers { get; set; }
        public bool SpringSemester { get; set; }
        public int StartingHour { get; set; }
        public string WeekDay { get; set; }
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
            var activities = _activityRepository.GetActivitiesForDay(
                    request.GroupId, request.SessionNumbers, 
                    request.SpringSemester, Enum.Parse<WeekDay>(request.WeekDay, true))
                .ToList().Where(x => x.IsOverlapping(request.StartingHour, request.Duration));
            return Task.FromResult(activities.Select(activity => new ActivityResponse
            {
                ActivityId = activity.Id,
                Name = activity.Name,
                TeacherFullName = activity.TeacherFullName,
                Room = activity.Room,
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
                },
                Building = activity.BuildingId == null ? null : new BuildingResponse
                {
                    BuildingId = activity.BuildingId.Value,
                    Name = activity.Building.Name,
                    Link = activity.Building.Link,
                }
            }));
        }
    }
}
