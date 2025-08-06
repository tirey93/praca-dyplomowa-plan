using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Session.Queries
{
    public class GetByGroupQuery : IRequest<IEnumerable<SessionResponse>>
    {
        public int GroupId { get; set; }
    }

    public class GetByGroupQueryHandler : IRequestHandler<GetByGroupQuery, IEnumerable<SessionResponse>>
    {
        private readonly ISessionRepository _sessionRepository;

        public GetByGroupQueryHandler(ISessionRepository sessionRepository)
        {
            _sessionRepository = sessionRepository;
        }

        public Task<IEnumerable<SessionResponse>> Handle(GetByGroupQuery request, CancellationToken cancellationToken)
        {
            var sessions = _sessionRepository.GetByGroup(request.GroupId).OrderBy(x => x.SpringSemester).ThenBy(x => x.Number);
            return Task.FromResult(sessions.Select(session => new SessionResponse
            {
                SessionId = session.Id,
                GroupId = session.GroupId,
                Number = session.Number,
                WeekNumber = session.WeekNumber,
                SpringSemester = session.SpringSemester,
            }));
        }
    }
}
