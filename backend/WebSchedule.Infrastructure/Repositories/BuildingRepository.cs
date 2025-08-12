
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Repositories;

namespace WebSchedule.Infrastructure.Repositories
{
    internal class BuildingRepository : Repository<Building>, IBuildingRepostory
    {
        public BuildingRepository(AppDbContext appDbContext) : base(appDbContext, appDbContext.Buildings)
        {
        }

        public Building Get(int id)
        {
            return _dbSet.FirstOrDefault(x => x.Id == id);
        }

        public IEnumerable<Building> Get()
        {
            return _dbSet;
        }

        public bool IsNameExists(string name)
        {
            return _dbSet.Any(x => x.Name == name);
        }

        public async Task AddBuildingAsync(Building building)
        {
            await _dbSet.AddAsync(building);
        }
    }
}
