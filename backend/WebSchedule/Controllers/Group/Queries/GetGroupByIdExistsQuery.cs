using MediatR;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Group.Queries
{
    public class GetGroupByIdExistsQuery : IRequest<bool>
    {
        public int GroupId { get; set; }
    }

    public class GetGroupByIdExistsQueryHandler : IRequestHandler<GetGroupByIdExistsQuery, bool>
    {
        private readonly IGroupRepository _groupRepository;

        public GetGroupByIdExistsQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public Task<bool> Handle(GetGroupByIdExistsQuery request, CancellationToken cancellationToken)
        {
            return Task.FromResult(_groupRepository.GroupExists(request.GroupId));
            
        }
    }
}
