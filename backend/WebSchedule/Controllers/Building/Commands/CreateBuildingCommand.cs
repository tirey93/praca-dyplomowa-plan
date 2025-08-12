using MediatR;
using WebSchedule.Controllers.Building.Commands;
using WebSchedule.Controllers.Building.Exceptions;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Controllers.Building.Commands
{
    public class CreateBuildingCommand : IRequest<BuildingResponse>
    {
        public string Name { get; set; }
        public string Link { get; set; }
    }
}

public class CreateBuildingCommandHandler : IRequestHandler<CreateBuildingCommand, BuildingResponse>
{
    private readonly IBuildingRepostory _buildingRepostory;

    public CreateBuildingCommandHandler(IBuildingRepostory buildingRepostory)
    {
        _buildingRepostory = buildingRepostory;
    }

    public async Task<BuildingResponse> Handle(CreateBuildingCommand request, CancellationToken cancellationToken)
    {
        var nameExists = _buildingRepostory.IsNameExists(request.Name);
        if (nameExists) 
            throw new BuildingNameExistsException(request.Name);

        var building = new Building
        {
            Name = request.Name,
            Link = request.Link,
        };
        await _buildingRepostory.AddBuildingAsync(building);

        await _buildingRepostory.SaveChangesAsync();

        return new BuildingResponse
        {
            BuildingId = building.Id,
            Name = building.Name,
            Link = building.Link,
        };
    }
}