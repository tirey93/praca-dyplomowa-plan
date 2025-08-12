
using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface IBuildingRepostory : IRepository<Building>
    {
        Task AddBuildingAsync(Building building);
        Building Get(int id);
        IEnumerable<Building> Get();
        bool IsNameExists(string name);
    }
}
