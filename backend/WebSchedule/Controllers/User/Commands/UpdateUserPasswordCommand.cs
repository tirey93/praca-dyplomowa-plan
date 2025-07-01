using MediatR;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain.Repositories;
using WebSchedule.Utils;

namespace WebSchedule.Controllers.User.Commands
{
    public class UpdateUserPasswordCommand : IRequest
    {
        public int UserId { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }

    public class UpdateUserPasswordCommandHandler : IRequestHandler<UpdateUserPasswordCommand>
    {
        private readonly IUserRepository _userRepository;

        public UpdateUserPasswordCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task Handle(UpdateUserPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = _userRepository.Get(request.UserId)
                    ?? throw new UserNotFoundException(request.UserId.ToString());
            if (user.HashedPassword != ShaHelper.QuickHash(request.CurrentPassword))
            {
                throw new CurrentPasswordDidntMatchException();
            }

            user.HashedPassword = ShaHelper.QuickHash(request.NewPassword);
            await _userRepository.SaveChangesAsync();
        }
    }
}
