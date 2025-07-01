using MediatR;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.User.Commands
{
    public class UpdateUserDisplayNameCommand : IRequest
    {
        public int UserId { get; set; }
        public string DisplayName { get; set; }
    }

    public class UpdateUserDisplayNameCommandHandler : IRequestHandler<UpdateUserDisplayNameCommand>
    {
        private readonly IUserRepository _userRepository;

        public UpdateUserDisplayNameCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task Handle(UpdateUserDisplayNameCommand request, CancellationToken cancellationToken)
        {
            var user = _userRepository.Get(request.UserId)
                    ?? throw new UserNotFoundException(request.UserId.ToString());

            user.DisplayName = request.DisplayName;
            await _userRepository.SaveChangesAsync();
        }
    }
}
