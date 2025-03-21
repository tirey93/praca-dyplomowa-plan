using MediatR;
using WebSchedule.Controllers.Authentication.Commands;
using WebSchedule.Controllers.Responses;

namespace WebSchedule.Controllers.Authentication.Commands
{
    public class RegisterCommand : IRequest<UserResponse>
    {
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Password { get; set; }
    }
}


public class RegisterCommandHandler : IRequestHandler<RegisterCommand, UserResponse>
{
    public RegisterCommandHandler()
    {

    }

    public async Task<UserResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}