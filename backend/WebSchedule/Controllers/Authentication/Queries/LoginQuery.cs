using MediatR;
using WebSchedule.Controllers.Authentication.Exceptions;
using WebSchedule.Controllers.Authentication.Queries;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;
using WebSchedule.Utils;

namespace WebSchedule.Controllers.Authentication.Queries
{
    public class LoginQuery : IRequest<LoginResponse>
    {
        public string Login { get; set; }
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

    public Task<LoginResponse> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        var hash = ShaHelper.QuickHash(request.Password);
        var user = _userRepository.TryLoginByPassword(request.Login, hash)
                ?? throw new LoginFailedException(request.Login);

        if (!user.IsActive)
            throw new UserIsNotActiveException(user.Id);

        return Task.FromResult(new LoginResponse
        {
            UserId = user.Id,
        });
    }
}