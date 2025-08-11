
using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Domain.Repositories
{
    public interface IBuildingRepostory : IRepository<Building>
    {
        Building Get(int id);
    }
}
