using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.SessionInGroup.Queries
{
    public class GetDefaultQuery : IRequest<IEnumerable<SessionInGroupResponse>>
    {
    }

    public class GetDefaultQueryHandler : IRequestHandler<GetDefaultQuery, IEnumerable<SessionInGroupResponse>>
    {
        private readonly ISessionInGroupRepository _sessionInGroupRepository;

        public GetDefaultQueryHandler(ISessionInGroupRepository sessionInGroupRepository)
        {
            _sessionInGroupRepository = sessionInGroupRepository;
        }

        public Task<IEnumerable<SessionInGroupResponse>> Handle(GetDefaultQuery request, CancellationToken cancellationToken)
        {
            var sessions = _sessionInGroupRepository.GetDefaults();
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
