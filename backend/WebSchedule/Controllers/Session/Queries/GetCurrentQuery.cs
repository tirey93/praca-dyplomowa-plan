using MediatR;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Session.Queries
{
    public class GetCurrentQuery : IRequest<SessionInGroupResponse>
    {
        public int GroupId { get; set; }
    }

    public class GetCurrentQueryHandler : IRequestHandler<GetCurrentQuery, SessionInGroupResponse>
    {
        private readonly ISessionRepository _sessionRepository;
        private readonly IGroupRepository _groupRepository;

        public GetCurrentQueryHandler(ISessionRepository sessionRepository, IGroupRepository groupRepository)
        {
            _sessionRepository = sessionRepository;
            _groupRepository = groupRepository;
        }

        public Task<SessionInGroupResponse> Handle(GetCurrentQuery request, CancellationToken cancellationToken)
        {
            var group = _groupRepository.Get(request.GroupId)
                ?? throw new GroupNotFoundException(request.GroupId);

            var session = _sessionRepository.GetCurrentSession(group.Id, group.SpringSemester)
                ?? _sessionRepository.GetDefaultCurrentSession(group.SpringSemester)
                ?? _sessionRepository.GetFirstSession(group.SpringSemester);
            return Task.FromResult(new SessionInGroupResponse
            {
                SessionId = session.Id,
                GroupId = session.GroupId,
                Number = session.Number,
                WeekNumber = session.WeekNumber,
                SpringSemester = session.SpringSemester,
            });
        }
    }
}
