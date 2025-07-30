using MediatR;
using WebSchedule.Controllers.Group.Commands;
using WebSchedule.Controllers.Session.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Session.Commands
{
    public class UpdateSessionsInGroupCommand : IRequest
    {
        public int GroupId { get; set; }
        public SessionCommand Session { get; set; }
    }

    public class UpdateSessionsInGroupCommandHandler : IRequestHandler<UpdateSessionsInGroupCommand>
    {
        private readonly ISessionRepository _sessionRepository;

        public UpdateSessionsInGroupCommandHandler(ISessionRepository sessionRepository)
        {
            _sessionRepository = sessionRepository;
        }

        public async Task Handle(UpdateSessionsInGroupCommand request, CancellationToken cancellationToken)
        {
            var session = _sessionRepository.Get(request.GroupId, request.Session.Number, request.Session.SpringSemester)
                ?? throw new SessionInGroupNotFoundException();

            session.UpdateWeek(request.Session.WeekNumber);
            await _sessionRepository.SaveChangesAsync();
        }
    }
}
