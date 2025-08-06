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
        public int WeekNumber { get; set; }
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
                .Select(x => _sessionRepository.GetNext(x, request.WeekNumber))
                .OrderBy(x => x.Number).ThenBy(x => x.WeekNumber)
                .FirstOrDefault();
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
