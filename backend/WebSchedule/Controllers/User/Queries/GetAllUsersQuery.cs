using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.User.Queries
{
    public class GetAllUsersQuery : IRequest<IEnumerable<UserResponse>>
    {
    }

    public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, IEnumerable<UserResponse>>
    {
        private readonly IUserRepository _userRepository;

        public GetAllUsersQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public Task<IEnumerable<UserResponse>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
        {
            var users = _userRepository.Get();
            return Task.FromResult(users.Select(user => new UserResponse
            {
                Id = user.Id,
                Login = user.Login,
                DisplayName = user.DisplayName,
                IsActive = user.IsActive
            }));
        }
    }
}
