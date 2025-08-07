using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.User.Queries
{
    public class GetAllUsersQuery : IRequest<IEnumerable<UserResponseWithGroupCount>>
    {
    }

    public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, IEnumerable<UserResponseWithGroupCount>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserInGroupRepository _userInGroupRepository;

        public GetAllUsersQueryHandler(IUserRepository userRepository, IUserInGroupRepository userInGroupRepository)
        {
            _userRepository = userRepository;
            _userInGroupRepository = userInGroupRepository;
        }

        public Task<IEnumerable<UserResponseWithGroupCount>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
        {
            var users = _userRepository.Get();
            var userInGroupCounts = _userInGroupRepository.GetUserInGroupCount().ToDictionary(x => x.UserId, y => y.Count);
            return Task.FromResult(users.Select(user => new UserResponseWithGroupCount
            {
                Id = user.Id,
                Login = user.Login,
                DisplayName = user.DisplayName,
                IsActive = user.IsActive,
                GroupCount = GetUserCount(userInGroupCounts, user.Id),
            }));
        }

        private int GetUserCount(Dictionary<int, int> dictionary, int userId)
        {
            if (dictionary.TryGetValue(userId, out var count))
            {
                return count;
            }
            return 0;
        }
    }
}
