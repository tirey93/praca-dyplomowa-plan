﻿using Domain.Exceptions;
using MediatR;
using WebSchedule.Controllers.Authentication.Exceptions;
using WebSchedule.Controllers.Authentication.Queries;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain.Repositories;
using WebSchedule.Utils;

namespace WebSchedule.Controllers.User.Queries
{
    public class GetUserQuery : IRequest<UserResponse>
    {
        public int UserId { get; set; }
    }

    public class GetUserQueryHandler : IRequestHandler<GetUserQuery, UserResponse>
    {
        private readonly IUserRepository _userRepository;

        public GetUserQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public Task<UserResponse> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            var user = _userRepository.Get(request.UserId)
                    ?? throw new UserNotFoundException(request.UserId.ToString());


            return Task.FromResult(new UserResponse
            {
                Id = user.Id,
                Name = user.Name,
                DisplayName = user.DisplayName,
                Role = user.Role.ToString(),
                IsActive = user.IsActive
            });
        }
    }
}
