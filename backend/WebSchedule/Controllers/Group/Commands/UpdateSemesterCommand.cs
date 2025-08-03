using MediatR;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Group.Commands
{
    public class UpdateSemesterCommand : IRequest
    {
        public int GroupId { get; set; }
        public bool SpringSemester { get; set; }
    }

    public class UpdateSemesterCommandHandler : IRequestHandler<UpdateSemesterCommand>
    {
        private readonly IGroupRepository _groupRepository;

        public UpdateSemesterCommandHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task Handle(UpdateSemesterCommand request, CancellationToken cancellationToken)
        {
            var group = _groupRepository.Get(request.GroupId)
                ?? throw new GroupNotFoundException(request.GroupId);

            group.UpdateSemester(request.SpringSemester);
            await _groupRepository.SaveChangesAsync();
        }
    }
}
