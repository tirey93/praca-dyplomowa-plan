using MediatR;
using WebSchedule.Domain.Repositories;
using WebSchedule.Infrastructure.Repositories;

namespace WebSchedule.Controllers.Group.Commands
{
    public class UpdateSessionsInGroupCommand : IRequest
    {
        public int GroupId { get; set; }
        public bool SpringSemester { get; set; }
        public List<SessionCommand> Sessions { get; set; }
    }

    public class UpdateSessionsInGroupCommandHandler : IRequestHandler<UpdateSessionsInGroupCommand>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly ISessionInGroupRepository _sessionInGroupRepository;

        public UpdateSessionsInGroupCommandHandler(IGroupRepository groupRepository, ISessionInGroupRepository sessionInGroupRepository)
        {
            _groupRepository = groupRepository;
            _sessionInGroupRepository = sessionInGroupRepository;
        }

        public async Task Handle(UpdateSessionsInGroupCommand request, CancellationToken cancellationToken)
        {
            var group = _groupRepository.Get(request.GroupId);

            foreach (var session in group.SessionsInGroup.Where(x => x.SpringSemester == request.SpringSemester))
            {
                _sessionInGroupRepository.Remove(session);
            }

            group.AddSessions(request.Sessions.Select(x =>
                new Domain.Entities.Study.SessionInGroup(group, x.Number, x.WeekNumber, x.SpringSemester)));
            await _sessionInGroupRepository.SaveChangesAsync();
            await _groupRepository.SaveChangesAsync();
        }
    }
}
