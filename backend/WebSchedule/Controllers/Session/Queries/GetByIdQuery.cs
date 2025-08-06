using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.Session.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Session.Queries
{
    public class GetByIdQuery : IRequest<SessionResponse>
    {
        public int SessionId { get; set; }
    }

    public class GetByIdQueryHandler : IRequestHandler<GetByIdQuery, SessionResponse>
    {
        private readonly ISessionRepository _sessionRepository;

        public GetByIdQueryHandler(ISessionRepository sessionRepository)
        {
            _sessionRepository = sessionRepository;
        }

        public Task<SessionResponse> Handle(GetByIdQuery request, CancellationToken cancellationToken)
        {
            var session = _sessionRepository.Get(request.SessionId)
                ?? throw new SessionInGroupNotFoundException();
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
