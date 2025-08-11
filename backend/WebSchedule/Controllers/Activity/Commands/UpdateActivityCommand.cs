using MediatR;
using WebSchedule.Controllers.Activity.Exceptions;
using WebSchedule.Controllers.Building.Exceptions;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Activity.Commands
{
    public class UpdateActivityCommand : IRequest
    {
        public int ActivityId { get; set; }
        public int BuildingId { get; set; }
        public string Name { get; set; }
        public string TeacherFullName { get; set; }
        public int StartingHour { get; set; }
        public string WeekDay { get; set; }
        public int Duration { get; set; }
        public string Room { get; set; }
    }

    public class UpdateActivityCommandHandler : IRequestHandler<UpdateActivityCommand>
    {
        private readonly IActivityRepository _activityRepository;
        private readonly IBuildingRepostory _buildingRepostory;

        public UpdateActivityCommandHandler(IActivityRepository activityRepository, IBuildingRepostory buildingRepostory)
        {
            _activityRepository = activityRepository;
            _buildingRepostory = buildingRepostory;
        }

        public async Task Handle(UpdateActivityCommand request, CancellationToken cancellationToken)
        {
            var activity = _activityRepository.Get(request.ActivityId)
                ?? throw new ActivityNotFoundException(request.ActivityId);

            var building = _buildingRepostory.Get(request.BuildingId)
                ?? throw new BuildingNotFoundException(request.BuildingId);

            activity.SetName(request.Name);
            activity.SetTeachFullName(request.TeacherFullName);
            activity.SetStartingHour(request.StartingHour);
            activity.SetWeekDay(Enum.Parse<WeekDay>(request.WeekDay, true));
            activity.SetDuration(request.Duration);
            activity.SetRoom(request.Room);
            activity.SetBuilding(building);

            await _activityRepository.SaveChangesAsync();
        }
    }
}