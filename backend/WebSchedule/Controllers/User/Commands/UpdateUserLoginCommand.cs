using MediatR;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.User.Commands
{
    public class UpdateUserLoginCommand : IRequest
    {
        public int UserId { get; set; }
        public string Login { get; set; }
    }

    public class UpdateUserLoginCommandHandler : IRequestHandler<UpdateUserLoginCommand>
    {
        private readonly IUserRepository _userRepository;

        public UpdateUserLoginCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task Handle(UpdateUserLoginCommand request, CancellationToken cancellationToken)
        {
            var user = _userRepository.Get(request.UserId)
                    ?? throw new UserNotFoundException(request.UserId.ToString());

            user.Login = request.Login;
            await _userRepository.SaveChangesAsync();
        }
    }
}
