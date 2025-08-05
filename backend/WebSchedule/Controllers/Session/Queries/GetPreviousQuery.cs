using MediatR;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.Session.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Session.Queries
{
    public class GetPreviousQuery : IRequest<SessionInGroupResponse>
    {
        public int SessionId { get; set; }
    }

    public class GetPreviousQueryHandler : IRequestHandler<GetPreviousQuery, SessionInGroupResponse>
    {
        private readonly ISessionRepository _sessionRepository;

        public GetPreviousQueryHandler(ISessionRepository sessionRepository)
        {
            _sessionRepository = sessionRepository;
        }

        public Task<SessionInGroupResponse> Handle(GetPreviousQuery request, CancellationToken cancellationToken)
        {
            var currentSession = _sessionRepository.Get(request.SessionId)
                ?? throw new SessionInGroupNotFoundException();

            var session = _sessionRepository.GetPrevious(currentSession);
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
