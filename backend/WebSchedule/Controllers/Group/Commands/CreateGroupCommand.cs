using MediatR;
using WebSchedule.Controllers.Group.Commands;
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
        public string Level { get; set; }
        public int CourseId { get; set; }
        public int UserId { get; set; }

        public List<SessionCommand> Sessions { get; set; }
    }
}


public class CreateGroupCommandHandler : IRequestHandler<CreateGroupCommand, GroupResponse>
{
    private readonly IGroupRepository _groupRepository;
    private readonly IStudyCourseRepository _studyCourseRepository;
    private readonly IUserRepository _userRepository;
    private readonly ISessionRepository _sessionRepository;

    public CreateGroupCommandHandler(IGroupRepository groupRepository, 
        IStudyCourseRepository studyCourseRepository, IUserRepository userRepository, ISessionRepository sessionRepository)
    {
        _groupRepository = groupRepository;
        _studyCourseRepository = studyCourseRepository;
        _userRepository = userRepository;
        _sessionRepository = sessionRepository;
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
            request.Year, int.Parse(request.Subgroup), Enum.Parse<StudyLevel>(request.Level), request.CourseId);
        if (groupExists)
            throw new GroupAlreadyExistsException();

        var studyCourse = _studyCourseRepository.Get(request.CourseId);
        var user = _userRepository.Get(request.UserId);
        var group = new Group(
            request.Year,
            Enum.Parse<StudyLevel>(request.Level),
            studyCourse,
            user,
            int.Parse(request.Subgroup));

        var defaults = _sessionRepository.GetDefaults();
        foreach (var defaultSession in defaults)
        {
            var modification = request.Sessions.FirstOrDefault(x => x.SpringSemester == defaultSession.SpringSemester && x.Number == defaultSession.Number);
            var session = modification != null
                ? new Session(group, modification.Number, modification.WeekNumber, modification.SpringSemester)
                : new Session(group, defaultSession.Number, defaultSession.WeekNumber, defaultSession.SpringSemester);

            group.AddSession(session);
        }

        await _groupRepository.AddGroup(group);
        await _groupRepository.SaveChangesAsync();

        return new GroupResponse
        {
            Id = group.Id,
            StartingYear = group.StartingYear,
            StudyCourseName = studyCourse.Name,
            StudyCourseShort = studyCourse.ShortName,
            StudyLevel = group.StudyLevel.ToString(),
            Subgroup = group.Subgroup
        };
    }
}