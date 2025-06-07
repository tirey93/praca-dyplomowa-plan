using MediatR;
using WebSchedule.Domain.Repositories;
using WebSchedule.Responses;

namespace WebSchedule.Controllers.StudyCourse.Queries
{
    public class GetAllStudyCoursesQuery : IRequest<IEnumerable<StudyCourseResponse>>
    {
    }

    public class GetSearchedGroupsQueryHandler : IRequestHandler<GetAllStudyCoursesQuery, IEnumerable<StudyCourseResponse>>
    {
        private readonly IStudyCourseRepository _studyCourseRepository;

        public GetSearchedGroupsQueryHandler(IStudyCourseRepository studyCourseRepository)
        {
            _studyCourseRepository = studyCourseRepository;
        }

        public Task<IEnumerable<StudyCourseResponse>> Handle(GetAllStudyCoursesQuery request, CancellationToken cancellationToken)
        {
            var studyCourses = _studyCourseRepository.Get();

            return Task.FromResult(studyCourses.Select(sc => new StudyCourseResponse
            {
                Id = sc.Id,
                Name = sc.Name,
                ShortName = sc.ShortName,
            }));
        }
    }
}
