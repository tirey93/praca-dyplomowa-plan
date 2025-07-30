using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Session.Queries
{
    public class GetDefaultQuery : IRequest<IEnumerable<SessionInGroupResponse>>
    {
    }

    public class GetDefaultQueryHandler : IRequestHandler<GetDefaultQuery, IEnumerable<SessionInGroupResponse>>
    {
        private readonly ISessionRepository _sessionRepository;

        public GetDefaultQueryHandler(ISessionRepository sessionRepository)
        {
            _sessionRepository = sessionRepository;
        }

        public Task<IEnumerable<SessionInGroupResponse>> Handle(GetDefaultQuery request, CancellationToken cancellationToken)
        {
            var sessions = _sessionRepository.GetDefaults().OrderBy(x => x.SpringSemester).ThenBy(x => x.Number);
            return Task.FromResult(sessions.Select(session => new SessionInGroupResponse
            {
                GroupId = session.GroupId,
                Number = session.Number,
                WeekNumber = session.WeekNumber,
                SpringSemester = session.SpringSemester,
            }));
        }
    }
}
