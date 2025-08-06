using MediatR;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.Session.Exceptions;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain.Repositories;
using WebSchedule.Infrastructure.Repositories;

namespace WebSchedule.Controllers.Session.Queries
{
    public class GetNextQuery : IRequest<SessionResponse>
    {
        public int SessionNumber { get; set; }
        public int WeekNumber { get; set; }
        public bool SpringSemester { get; set; }
        public int[] GroupIds { get; set; }
    }

    public class GetNextQueryHandler : IRequestHandler<GetNextQuery, SessionResponse>
    {
        private readonly ISessionRepository _sessionRepository;
        private readonly IUserInGroupRepository _userInGroupRepository;

        public GetNextQueryHandler(ISessionRepository sessionRepository, IUserInGroupRepository userInGroupRepository)
        {
            _sessionRepository = sessionRepository;
            _userInGroupRepository = userInGroupRepository;
        }

        public Task<SessionResponse> Handle(GetNextQuery request, CancellationToken cancellationToken)
        {
            var session = GetNextSession(request);

            return Task.FromResult(new SessionResponse
            {
                SessionId = session.Id,
                Number = session.Number,
                WeekNumber = session.WeekNumber,
                SpringSemester = session.SpringSemester,
                GroupId = session.GroupId,
            });
        }

        private Domain.Entities.Study.Session GetNextSession(GetNextQuery request)
        {
            var session = request.GroupIds
                .Select(x => _sessionRepository.GetNext(x, request.SpringSemester, request.SessionNumber, request.WeekNumber))
                .Where(x => x != null)
                .OrderBy(x => x.Number).ThenBy(x => x.WeekNumber)
                .FirstOrDefault();
            if (session == null)
            {
                session = request.GroupIds
                    .Select(x => _sessionRepository.GetNext(x, request.SpringSemester, request.SessionNumber + 1, request.WeekNumber))
                    .Where(x => x != null)
                    .OrderBy(x => x.Number).ThenBy(x => x.WeekNumber)
                    .FirstOrDefault();
            }
            if (session == null && request.GroupIds.Select(x => _sessionRepository.IsLastWeekInGroup(x, request.WeekNumber)).All(x => x))
            {
                session = request.GroupIds
                    .Select(x => _sessionRepository.GetNext(x, request.SpringSemester, request.SessionNumber + 1, 0))
                    .Where(x => x != null)
                    .OrderBy(x => x.Number).ThenBy(x => x.WeekNumber)
                    .FirstOrDefault();
            }
            if (session == null)
            {
                session = request.GroupIds
                   .Select(x => _sessionRepository.GetFirstSession(x, true))
                   .OrderBy(x => x.Number).ThenBy(x => x.WeekNumber)
                   .FirstOrDefault();
            }
            return session;
        }
    }
}
