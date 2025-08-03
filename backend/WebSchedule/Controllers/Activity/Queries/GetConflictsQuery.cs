using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Activity.Queries
{
    public class GetConflictsQuery : IRequest<IEnumerable<ActivityResponse>>
    {
        public int GroupId { get; set; }
        public int[] SessionNumbers { get; set; }
        public bool SpringSemester { get; set; }
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
            var activities = _activityRepository.GetActivitiesForSession(request.GroupId, request.SessionNumbers, request.SpringSemester)
                .ToList().Where(x => x.IsOverlapping(request.StartingHour, request.Duration));
            return Task.FromResult(activities.Select(activity => new ActivityResponse
            {
                ActivityId = activity.Id,
                Name = activity.Name,
                TeacherFullName = activity.TeacherFullName,
                StartingHour = activity.StartingHour,
                Duration = activity.Duration,
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
