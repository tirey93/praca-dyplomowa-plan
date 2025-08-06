using MediatR;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Session.Queries
{
    public class GetCurrentQuery : IRequest<SessionResponse>
    {
        public int GroupId { get; set; }
    }

    public class GetCurrentQueryHandler : IRequestHandler<GetCurrentQuery, SessionResponse>
    {
        private readonly ISessionRepository _sessionRepository;
        private readonly IGroupRepository _groupRepository;

        public GetCurrentQueryHandler(ISessionRepository sessionRepository, IGroupRepository groupRepository)
        {
            _sessionRepository = sessionRepository;
            _groupRepository = groupRepository;
        }

        public Task<SessionResponse> Handle(GetCurrentQuery request, CancellationToken cancellationToken)
        {
            var group = _groupRepository.Get(request.GroupId)
                ?? throw new GroupNotFoundException(request.GroupId);

            var session = _sessionRepository.GetCurrentSession(group.Id, group.SpringSemester)
                ?? _sessionRepository.GetFirstSession(group.Id, group.SpringSemester);
            return Task.FromResult(new SessionResponse
            {
                SessionId = session.Id,
                Number = session.Number,
                WeekNumber = session.WeekNumber,
                SpringSemester = session.SpringSemester,
                GroupId = session.GroupId,
            });
        }
    }
}
