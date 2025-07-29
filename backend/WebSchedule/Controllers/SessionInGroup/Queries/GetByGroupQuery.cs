using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.SessionInGroup.Queries
{
    public class GetByGroupQuery : IRequest<IEnumerable<SessionInGroupResponse>>
    {
        public int GroupId { get; set; }
    }

    public class GetByGroupQueryHandler : IRequestHandler<GetByGroupQuery, IEnumerable<SessionInGroupResponse>>
    {
        private readonly ISessionInGroupRepository _sessionInGroupRepository;

        public GetByGroupQueryHandler(ISessionInGroupRepository sessionInGroupRepository)
        {
            _sessionInGroupRepository = sessionInGroupRepository;
        }

        public Task<IEnumerable<SessionInGroupResponse>> Handle(GetByGroupQuery request, CancellationToken cancellationToken)
        {
            var sessions = _sessionInGroupRepository.GetByGroup(request.GroupId).OrderBy(x => x.SpringSemester).ThenBy(x => x.Number);
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
