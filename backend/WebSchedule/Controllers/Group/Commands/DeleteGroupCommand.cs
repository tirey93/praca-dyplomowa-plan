using MediatR;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.StudyCourse.Commands;
using WebSchedule.Controllers.StudyCourse.Exceptions;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.StudyCourse.Commands
{
    public class DeleteGroupCommand : IRequest
    {
        public int GroupId { get; set; }
    }
}

public class DeleteGroupCommandHandler : IRequestHandler<DeleteGroupCommand>
{
    private readonly IGroupRepository _groupRepository;
    private readonly IStudyCourseRepository _studyCourseRepository;
    public DeleteGroupCommandHandler(IGroupRepository groupRepository)
    {
        _groupRepository = groupRepository;
    }

    public async Task Handle(DeleteGroupCommand request, CancellationToken cancellationToken)
    {
        var group = _groupRepository.Get(request.GroupId)
            ?? throw new GroupNotFoundException(request.GroupId);
        group.RemoveAllMembers();

        _groupRepository.Remove(group);
        await _groupRepository.SaveChangesAsync();
    }
}