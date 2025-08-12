namespace WebSchedule.Controllers.Building.Exceptions
{
    public class BuildingNameExistsException : ApplicationException
    {
        public BuildingNameExistsException(string buildingName) : base("ExceptionBuildingNameExists", buildingName)
        {
        }
    }
}
