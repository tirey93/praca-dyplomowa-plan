using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Session.Queries
{
    public class GetCurrentForLoggedQuery : IRequest<SessionResponse>
    {
        public int UserId { get; set; }
    }

    public class GetCurrentForLoggedQueryHandler : IRequestHandler<GetCurrentForLoggedQuery, SessionResponse>
    {
        private readonly ISessionRepository _sessionRepository;
        private readonly IUserInGroupRepository _userInGroupRepository;

        public GetCurrentForLoggedQueryHandler(ISessionRepository sessionRepository, IUserInGroupRepository userInGroupRepository)
        {
            _sessionRepository = sessionRepository;
            _userInGroupRepository = userInGroupRepository;
        }

        public Task<SessionResponse> Handle(GetCurrentForLoggedQuery request, CancellationToken cancellationToken)
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

        private Domain.Entities.Study.Session GetNextSession(GetCurrentForLoggedQuery request)
        {
            var groups = _userInGroupRepository.GetUserGroupsByUser(request.UserId)
                    .Where(x => !x.IsCandidate)
                    .Select(x => x.Group);

            var sessions = new List<Domain.Entities.Study.Session>();
            foreach (var group in groups.ToList())
            {
                sessions.Add(_sessionRepository.GetCurrentSession(group.Id, group.SpringSemester)
                    ?? _sessionRepository.GetFirstSession(group.Id, group.SpringSemester));
            }

            return sessions.OrderBy(x => x.Number).ThenBy(x => x.WeekNumber).FirstOrDefault();
        }
    }
}
