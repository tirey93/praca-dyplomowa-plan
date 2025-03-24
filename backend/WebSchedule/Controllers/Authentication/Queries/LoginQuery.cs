using Domain.Exceptions;
using MediatR;
using WebSchedule.Controllers.Authentication.Exceptions;
using WebSchedule.Controllers.Authentication.Queries;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;
using WebSchedule.Utils;

namespace WebSchedule.Controllers.Authentication.Queries
{
    public class LoginQuery : IRequest<UserResponse>
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}

public class LoginQueryHandler : IRequestHandler<LoginQuery, UserResponse>
{
    private readonly IUserRepository _userRepository;

    public LoginQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserResponse> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        var hash = ShaHelper.QuickHash(request.Password);
        var user = await _userRepository.TryLoginByPassword(request.Username, hash)
                ?? throw new LoginFailedException(request.Username);

        if (!user.IsActive)
            throw new UserIsNotActiveException(user.Id);

        return new UserResponse
        {
            Id = user.Id,
            Name = user.Name,
            DisplayName = user.DisplayName,
            Role = "Role",
            IsActive = user.IsActive
        };
    }
}