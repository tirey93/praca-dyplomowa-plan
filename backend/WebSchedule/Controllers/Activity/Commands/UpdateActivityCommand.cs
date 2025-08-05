using MediatR;
using WebSchedule.Controllers.Activity.Exceptions;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Activity.Commands
{
    public class UpdateActivityCommand : IRequest
    {
        public int ActivityId { get; set; }
        public string Name { get; set; }
        public string TeacherFullName { get; set; }
        public int StartingHour { get; set; }
        public string WeekDay { get; set; }
        public int Duration { get; set; }
    }

    public class CreateGroupCommandHandler : IRequestHandler<UpdateActivityCommand>
    {
        private readonly IActivityRepository _activityRepository;

        public CreateGroupCommandHandler(IActivityRepository activityRepository)
        {
            _activityRepository = activityRepository;
        }

        public async Task Handle(UpdateActivityCommand request, CancellationToken cancellationToken)
        {
            var activity = _activityRepository.Get(request.ActivityId)
                ?? throw new ActivityNotFoundException(request.ActivityId);

            activity.SetName(request.Name);
            activity.SetTeachFullName(request.TeacherFullName);
            activity.SetStartingHour(request.StartingHour);
            activity.SetWeekDay(Enum.Parse<WeekDay>(request.WeekDay, true));
            activity.SetDuration(request.Duration);

            await _activityRepository.SaveChangesAsync();
        }
    }
}