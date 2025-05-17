using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.User.Queries
{
    public class GetUserQuery : IRequest<UserResponse>
    {
        public int UserId { get; set; }
    }

    public class GetUserQueryHandler : IRequestHandler<GetUserQuery, UserResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserInGroupRepository _userInGroupRepository;

        public GetUserQueryHandler(IUserRepository userRepository, IUserInGroupRepository userInGroupRepository)
        {
            _userRepository = userRepository;
            _userInGroupRepository = userInGroupRepository;
        }

        public Task<UserResponse> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            var user = _userRepository.Get(request.UserId)
                    ?? throw new UserNotFoundException(request.UserId.ToString());

            var userGroups = _userInGroupRepository.GetUserGroups(request.UserId);
            var res = Task.FromResult(new UserResponse
            {
                Id = user.Id,
                Name = user.Name,
                DisplayName = user.DisplayName,
                Groups = userGroups.Select(x => new UserGroupResponse
                {
                    Id = x.Id,
                    IsAdmin = x.IsAdmin,
                    IsCandidate = x.IsCandidate,
                    GroupInfo = new GroupInfoResponse
                    {
                        Id = x.GroupId,
                        StartingYear = x.StartingYear,
                        StudyCourseName = x.StudyCourseName,
                        StudyCourseShort = x.StudyCourseShort,
                        StudyLevel = x.StudyLevel,
                        StudyMode = x.StudyMode
                    }
                }).ToList(),
                IsActive = user.IsActive
            });

            return res;
        }
    }
}
