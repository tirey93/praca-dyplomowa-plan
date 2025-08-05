using MediatR;
using WebSchedule.Controllers.Activity.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Activity.Commands
{
    public class DeleteActivityCommand : IRequest
    {
        public int ActivityId { get; set; }
    }

    public class DeleteActivityCommandHandler : IRequestHandler<DeleteActivityCommand>
    {
        private readonly IActivityRepository _activityRepository;

        public DeleteActivityCommandHandler(IActivityRepository activityRepository)
        {
            _activityRepository = activityRepository;
        }

        public async Task Handle(DeleteActivityCommand request, CancellationToken cancellationToken)
        {
            var activity = _activityRepository.Get(request.ActivityId)
                ?? throw new ActivityNotFoundException(request.ActivityId);

            _activityRepository.Remove(activity);

            await _activityRepository.SaveChangesAsync();
        }
    }
}