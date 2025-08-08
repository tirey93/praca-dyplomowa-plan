using MediatR;
using WebSchedule.Controllers.Activity.Exceptions;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Activity.Queries
{
    public class GetByIdQuery : IRequest<ActivityResponse>
    {
        public int ActivityId { get; set; }
    }

    public class GetByIdQueryHandler : IRequestHandler<GetByIdQuery, ActivityResponse>
    {
        private readonly IActivityRepository _activityRepository;

        public GetByIdQueryHandler(IActivityRepository activityRepository)
        {
            _activityRepository = activityRepository;
        }

        public Task<ActivityResponse> Handle(GetByIdQuery request, CancellationToken cancellationToken)
        {
            var activity = _activityRepository.Get(request.ActivityId)
                ?? throw new ActivityNotFoundException(request.ActivityId);

            return Task.FromResult(new ActivityResponse
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
            });
        }
    }
}
