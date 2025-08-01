﻿using MediatR;
using WebSchedule.Controllers.Authentication.Commands;
using WebSchedule.Controllers.Authentication.Exceptions;
using WebSchedule.Domain.Entities;
using WebSchedule.Domain.Repositories;
using WebSchedule.Utils;

namespace WebSchedule.Controllers.Authentication.Commands
{
    public class RegisterCommand : IRequest
    {
        public string Login { get; set; }
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
        var userExists = _userRepository.UserExists(request.Login);
        if (userExists) 
            throw new UserAlreadyExistsException(request.Login);

        await _userRepository.RegisterUserAsync(new User
        {
            DisplayName = request.DisplayName,
            HashedPassword = ShaHelper.QuickHash(request.Password),
            Login = request.Login,
            IsActive = true,
        });

        await _userRepository.SaveChangesAsync();
    }
}