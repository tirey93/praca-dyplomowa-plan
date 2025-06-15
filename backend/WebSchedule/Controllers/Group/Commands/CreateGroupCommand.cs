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
    public class CreateGroupCommand : IRequest<GroupResponse>
    {
        public int Year { get; set; }
        public string Subgroup { get; set; }
        public string Mode { get; set; }
        public string Level { get; set; }
        public int CourseId { get; set; }
        public int UserId { get; set; }
    }
}


public class CreateGroupCommandHandler : IRequestHandler<CreateGroupCommand, GroupResponse>
{
    private readonly IGroupRepository _groupRepository;
    private readonly IStudyCourseRepository _studyCourseRepository;
    private readonly IUserRepository _userRepository;

    public CreateGroupCommandHandler(IGroupRepository groupRepository, IStudyCourseRepository studyCourseRepository, IUserRepository userRepository)
    {
        _groupRepository = groupRepository;
        _studyCourseRepository = studyCourseRepository;
        _userRepository = userRepository;
    }

    public async Task<GroupResponse> Handle(CreateGroupCommand request, CancellationToken cancellationToken)
    {
        var studyExists = _studyCourseRepository.Exists(request.CourseId);
        if (!studyExists)
            throw new StudyCourseNotExistException(request.CourseId);

        var userExists = _userRepository.UserExists(request.UserId);
        if (!userExists)
            throw new UserNotFoundException(request.UserId.ToString());

        var groupExists = _groupRepository.GroupExists(
            request.Year, int.Parse(request.Subgroup), Enum.Parse<StudyMode>(request.Mode), Enum.Parse<StudyLevel>(request.Level), request.CourseId);
        if (groupExists)
            throw new GroupAlreadyExistsException();

        var studyCourse = _studyCourseRepository.Get(request.CourseId);
        var user = _userRepository.Get(request.UserId);
        var group = new Group
            (request.Year, Enum.Parse<StudyMode>(request.Mode), Enum.Parse<StudyLevel>(request.Level), studyCourse, user, int.Parse(request.Subgroup));
        
        await _groupRepository.AddGroup(group);
        await _groupRepository.SaveChangesAsync();

        return new GroupResponse
        {
            Id = group.Id,
            StartingYear = group.StartingYear,
            StudyCourseName = studyCourse.Name,
            StudyCourseShort = studyCourse.ShortName,
            StudyLevel = group.StudyLevel.ToString(),
            StudyMode = group.StudyMode.ToString(),
            Subgroup = group.Subgroup
        };
    }
}