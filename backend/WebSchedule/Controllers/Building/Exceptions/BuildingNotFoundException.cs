
namespace WebSchedule.Controllers.Building.Exceptions
{
    public class BuildingNotFoundException : ApplicationException
    {
        public BuildingNotFoundException(int buildingId) : base("ExceptionBuildingNotFoundException", buildingId.ToString())
        {
        }
    }
}
