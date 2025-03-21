using MediatR;
using WebSchedule.Controllers.Authentication.Queries;
using WebSchedule.Controllers.Responses;

namespace WebSchedule.Controllers.Authentication.Queries
{
    public class LoginQuery : IRequest<UserResponse>
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}

public class AuthenticationQueryHandler : IRequestHandler<LoginQuery, UserResponse>
{

    public AuthenticationQueryHandler()
    {

    }

    public Task<UserResponse> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}