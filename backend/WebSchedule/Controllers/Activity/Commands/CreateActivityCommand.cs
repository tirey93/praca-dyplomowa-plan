using MediatR;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Activity.Commands
{
    public class CreateActivityCommand : IRequest
    {
        public string Name { get; set; }
        public string TeacherFullName { get; set; }
        public int GroupId { get; set; }
        public int[] SessionNumbers { get; set; }
        public bool SpringSemester { get; set; }
        public int StartingHour { get; set; }
        public string WeekDay { get; set; }
        public int Duration { get; set; }
    }

    public class CreateActivityCommandHandler : IRequestHandler<CreateActivityCommand>
    {
        private readonly IActivityRepository _activityRepository;
        private readonly IGroupRepository _groupRepository;
        private readonly ISessionRepository _sessionRepository;

        public CreateActivityCommandHandler(IActivityRepository activityRepository, IGroupRepository groupRepository, ISessionRepository sessionRepository)
        {
            _activityRepository = activityRepository;
            _groupRepository = groupRepository;
            _sessionRepository = sessionRepository;
        }

        public async Task Handle(CreateActivityCommand request, CancellationToken cancellationToken)
        {
            var groupExists = _groupRepository.GroupExists(request.GroupId);
            if (!groupExists)
                throw new GroupNotFoundException(request.GroupId);

            var sessions = _sessionRepository.GetByGroup(request.GroupId)
                .Where(x => x.SpringSemester == request.SpringSemester && request.SessionNumbers.Contains(x.Number));

            foreach (var session in sessions)
            {
                await _activityRepository.AddActivity(new Domain.Entities.Study.Activity(
                    session, request.Name, 
                    request.TeacherFullName, 
                    request.StartingHour, 
                    request.Duration, 
                    Enum.Parse<WeekDay>(request.WeekDay, true))
                );
            }

            await _activityRepository.SaveChangesAsync();
        }
    }
}