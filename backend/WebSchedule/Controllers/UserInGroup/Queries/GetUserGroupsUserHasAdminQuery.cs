using MediatR;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.UserInGroup.Queries
{
    public class GetUserGroupsUserHasAdminQuery : IRequest<bool>
    {
        public int GroupId { get; set; }
        public int UserId { get; set; }
    }

    public class GetUserGroupsUserHasAdminQueryHandler : IRequestHandler<GetUserGroupsUserHasAdminQuery, bool>
    {
        private readonly IUserInGroupRepository _userInGroupRepository;

        public GetUserGroupsUserHasAdminQueryHandler(IUserInGroupRepository userInGroupRepository)
        {
            _userInGroupRepository = userInGroupRepository;
        }

        public Task<bool> Handle(GetUserGroupsUserHasAdminQuery request, CancellationToken cancellationToken)
        {
            var userGroup = _userInGroupRepository.Get(request.UserId, request.GroupId);

            return Task.FromResult(userGroup != null && userGroup.UserRole == Domain.Entities.Study.UserRole.Admin);
        }
    }
}
