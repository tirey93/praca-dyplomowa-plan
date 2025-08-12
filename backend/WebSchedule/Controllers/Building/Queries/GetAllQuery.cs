using MediatR;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Building.Queries
{
    public class GetAllQuery : IRequest<IEnumerable<BuildingResponse>>
    {
        public int? ExceptUserId { get; set; }
    }

    public class GetAllQueryHandler : IRequestHandler<GetAllQuery, IEnumerable<BuildingResponse>>
    {
        private readonly IBuildingRepostory _buildingRepostory;

        public GetAllQueryHandler(IBuildingRepostory buildingRepostory)
        {
            _buildingRepostory = buildingRepostory;
        }

        public Task<IEnumerable<BuildingResponse>> Handle(GetAllQuery request, CancellationToken cancellationToken)
        {
            var buildings = _buildingRepostory.Get();

            return Task.FromResult(buildings.Select(building => new BuildingResponse
            {
                BuildingId = building.Id,
                Name = building.Name,
                Link = building.Link,
            }));
        }
    }
}
