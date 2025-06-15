using MediatR;
using WebSchedule.Controllers.Authentication.Commands;
using WebSchedule.Controllers.Authentication.Exceptions;
using WebSchedule.Controllers.StudyCourse.Commands;
using WebSchedule.Controllers.StudyCourse.Exceptions;
using WebSchedule.Domain.Entities;
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;
using WebSchedule.Responses;
using WebSchedule.Utils;

namespace WebSchedule.Controllers.StudyCourse.Commands
{
    public class CreateStudyCourseCommand : IRequest<StudyCourseResponse>
    {
        public string Name { get; set; }
        public string ShortName { get; set; }
    }
}


public class CreateStudyCourseCommandHandler : IRequestHandler<CreateStudyCourseCommand, StudyCourseResponse>
{
    private readonly IStudyCourseRepository _studyCourseRepository;

    public CreateStudyCourseCommandHandler(IStudyCourseRepository studyCourseRepository)
    {
        _studyCourseRepository = studyCourseRepository;
    }

    public async Task<StudyCourseResponse> Handle(CreateStudyCourseCommand request, CancellationToken cancellationToken)
    {
        var nameExists = _studyCourseRepository.IsNameExists(request.Name);
        if (nameExists) 
            throw new StudyCourseNameExistsException(request.Name);
        var shortNameExists = _studyCourseRepository.IsShortNameExists(request.ShortName);
        if (shortNameExists)
            throw new StudyCourseShortNameExistsException(request.ShortName);

        var course = new StudyCourse
        {
            Name = request.Name,
            ShortName = request.ShortName,
        };
        await _studyCourseRepository.AddStudyCourseAsync(course);

        await _studyCourseRepository.SaveChangesAsync();

        return new StudyCourseResponse
        {
            Id = course.Id,
            Name = course.Name,
            ShortName = course.ShortName,
        };
    }
}