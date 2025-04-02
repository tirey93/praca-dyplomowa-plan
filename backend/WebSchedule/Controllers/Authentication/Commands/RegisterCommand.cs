using MediatR;
using WebSchedule.Controllers.Authentication.Commands;
using WebSchedule.Controllers.Authentication.Exceptions;
using WebSchedule.Domain.Entities;
using WebSchedule.Domain.Repositories;
using WebSchedule.Utils;

namespace WebSchedule.Controllers.Authentication.Commands
{
    public class RegisterCommand : IRequest
    {
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Password { get; set; }
    }
}


public class RegisterCommandHandler : IRequestHandler<RegisterCommand>
{
    private readonly IUserRepository _userRepository;

    public RegisterCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var userExists = _userRepository.UserExists(request.Username);
        if (userExists) 
            throw new UserAlreadyExistsException(request.Username);

        await _userRepository.RegisterUserAsync(new User
        {
            DisplayName = request.DisplayName,
            HashedPassword = ShaHelper.QuickHash(request.Password),
            Name = request.Username,
            //Role = Role.User,
            IsActive = true,
        });

        await _userRepository.SaveChangesAsync();
    }
}