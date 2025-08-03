using MediatR;
using WebSchedule.Controllers.Group.Commands;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Group.Commands
{
    public class DeleteGroupCommand : IRequest
    {
        public int GroupId { get; set; }
    }
}

public class DeleteGroupCommandHandler : IRequestHandler<DeleteGroupCommand>
{
    private readonly IGroupRepository _groupRepository;
    private readonly ISessionRepository _sessionRepository;
    public DeleteGroupCommandHandler(IGroupRepository groupRepository, ISessionRepository sessionRepository)
    {
        _groupRepository = groupRepository;
        _sessionRepository = sessionRepository;
    }

    public async Task Handle(DeleteGroupCommand request, CancellationToken cancellationToken)
    {
        var group = _groupRepository.Get(request.GroupId)
            ?? throw new GroupNotFoundException(request.GroupId);
        group.RemoveAllMembers();
        foreach (var session in _sessionRepository.GetByGroup(request.GroupId))
        {
            _sessionRepository.Remove(session);
        }

        await _sessionRepository.SaveChangesAsync();
        _groupRepository.Remove(group);
        await _groupRepository.SaveChangesAsync();
    }
}