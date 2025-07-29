using MediatR;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Controllers.StudyCourse.Commands;
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
    private readonly ISessionInGroupRepository _sessionInGroupRepository;
    public DeleteGroupCommandHandler(IGroupRepository groupRepository, ISessionInGroupRepository sessionInGroupRepository)
    {
        _groupRepository = groupRepository;
        _sessionInGroupRepository = sessionInGroupRepository;
    }

    public async Task Handle(DeleteGroupCommand request, CancellationToken cancellationToken)
    {
        var group = _groupRepository.Get(request.GroupId)
            ?? throw new GroupNotFoundException(request.GroupId);
        group.RemoveAllMembers();
        foreach (var session in _sessionInGroupRepository.GetByGroup(request.GroupId))
        {
            _sessionInGroupRepository.Remove(session);
        }

        await _sessionInGroupRepository.SaveChangesAsync();
        _groupRepository.Remove(group);
        await _groupRepository.SaveChangesAsync();
    }
}