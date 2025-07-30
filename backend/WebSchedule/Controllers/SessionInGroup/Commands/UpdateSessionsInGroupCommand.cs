using MediatR;
using WebSchedule.Controllers.Group.Commands;
using WebSchedule.Controllers.SessionInGroup.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.SessionInGroup.Commands
{
    public class UpdateSessionsInGroupCommand : IRequest
    {
        public int GroupId { get; set; }
        public SessionCommand Session { get; set; }
    }

    public class UpdateSessionsInGroupCommandHandler : IRequestHandler<UpdateSessionsInGroupCommand>
    {
        private readonly ISessionInGroupRepository _sessionInGroupRepository;

        public UpdateSessionsInGroupCommandHandler(ISessionInGroupRepository sessionInGroupRepository)
        {
            _sessionInGroupRepository = sessionInGroupRepository;
        }

        public async Task Handle(UpdateSessionsInGroupCommand request, CancellationToken cancellationToken)
        {
            var session = _sessionInGroupRepository.Get(request.GroupId, request.Session.Number, request.Session.SpringSemester)
                ?? throw new SessionInGroupNotFoundException();

            session.UpdateWeek(request.Session.WeekNumber);
            await _sessionInGroupRepository.SaveChangesAsync();
        }
    }
}
