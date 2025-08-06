using MediatR;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.Session.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Session.Queries
{
    public class GetPreviousQuery : IRequest<SessionResponse>
    {
        public int SessionNumber { get; set; }
        public int WeekNumber { get; set; }
        public bool SpringSemester { get; set; }
        public int[] GroupIds { get; set; }
    }

    public class GetPreviousQueryHandler : IRequestHandler<GetPreviousQuery, SessionResponse>
    {
        private readonly ISessionRepository _sessionRepository;

        public GetPreviousQueryHandler(ISessionRepository sessionRepository)
        {
            _sessionRepository = sessionRepository;
        }

        public Task<SessionResponse> Handle(GetPreviousQuery request, CancellationToken cancellationToken)
        {
            var session = GetPreviousSession(request);
            return Task.FromResult(new SessionResponse
            {
                SessionId = session.Id,
                Number = session.Number,
                WeekNumber = session.WeekNumber,
                SpringSemester = session.SpringSemester,
                GroupId = session.GroupId,
            });
        }

        private Domain.Entities.Study.Session GetPreviousSession(GetPreviousQuery request)
        {
            var session = request.GroupIds
                .Select(x => _sessionRepository.GetPrevious(x, request.SpringSemester, request.SessionNumber, request.WeekNumber))
                .Where(x => x != null)
                .OrderByDescending(x => x.Number).ThenByDescending(x => x.WeekNumber)
                .FirstOrDefault();
            if (session == null)
            {
                session = request.GroupIds
                    .Select(x => _sessionRepository.GetPrevious(x, request.SpringSemester, request.SessionNumber - 1, request.WeekNumber))
                    .Where(x => x != null)
                    .OrderByDescending(x => x.Number).ThenByDescending(x => x.WeekNumber)
                    .FirstOrDefault();
            }
            if (session == null && request.GroupIds.Select(x => _sessionRepository.IsFirstWeekInGroup(x, request.WeekNumber)).All(x => x))
            {
                session = request.GroupIds
                    .Select(x => _sessionRepository.GetPrevious(x, request.SpringSemester, request.SessionNumber - 1, 53))
                    .Where(x => x != null)
                    .OrderByDescending(x => x.Number).ThenByDescending(x => x.WeekNumber)
                    .FirstOrDefault();
            }
            if (session == null)
            {
                session = request.GroupIds
                   .Select(x => _sessionRepository.GetLastSession(x, false))
                   .OrderByDescending(x => x.Number).ThenByDescending(x => x.WeekNumber)
                   .FirstOrDefault();
            }
            return session;
        }
    }
}
