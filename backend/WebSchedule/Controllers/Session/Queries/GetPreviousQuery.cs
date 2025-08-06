using MediatR;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.Session.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Session.Queries
{
    public class GetPreviousQuery : IRequest<SessionResponse>
    {
        public int SessionId { get; set; }
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
            var currentSession = _sessionRepository.Get(request.SessionId)
                ?? throw new SessionInGroupNotFoundException();

            var session = _sessionRepository.GetPrevious(currentSession);
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
