using Domain.Exceptions;
using MediatR;
using WebSchedule.Controllers.Authentication.Exceptions;
using WebSchedule.Controllers.Authentication.Queries;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;
using WebSchedule.Utils;

namespace WebSchedule.Controllers.Authentication.Queries
{
    public class LoginQuery : IRequest<LoginResponse>
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}

public class LoginQueryHandler : IRequestHandler<LoginQuery, LoginResponse>
{
    private readonly IUserRepository _userRepository;

    public LoginQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<LoginResponse> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        var hash = ShaHelper.QuickHash(request.Password);
        var user = _userRepository.TryLoginByPassword(request.Username, hash)
                ?? throw new LoginFailedException(request.Username);

        if (!user.IsActive)
            throw new UserIsNotActiveException(user.Id);

        return new LoginResponse
        {
            UserId = user.Id,
        };
    }
}