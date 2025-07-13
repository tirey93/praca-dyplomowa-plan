using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.User.Queries
{
    public class GetUserQuery : IRequest<UserResponse>
    {
        public int UserId { get; set; }
    }

    public class GetUserQueryHandler : IRequestHandler<GetUserQuery, UserResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserInGroupRepository _userInGroupRepository;

        public GetUserQueryHandler(IUserRepository userRepository, IUserInGroupRepository userInGroupRepository)
        {
            _userRepository = userRepository;
            _userInGroupRepository = userInGroupRepository;
        }

        public Task<UserResponse> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            var user = _userRepository.Get(request.UserId)
                    ?? throw new UserNotFoundException(request.UserId.ToString());

            var userGroups = _userInGroupRepository.GetUserGroupsByUser(request.UserId);
            return Task.FromResult(new UserResponse
            {
                Id = user.Id,
                Login = user.Login,
                DisplayName = user.DisplayName,
                IsActive = user.IsActive
            });
        }
    }
}
