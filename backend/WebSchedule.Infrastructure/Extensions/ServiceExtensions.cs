
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using WebSchedule.Domain.Repositories;
using WebSchedule.Infrastructure.Repositories;

namespace WebSchedule.Infrastructure.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddInfrastructure(this IServiceCollection services, string connectionString)
        {
            services.AddDbContext<AppDbContext>(options => options.UseMySQL(connectionString));
            services.AddScoped<IUserRepository, UserRepository>();
        }
    }
}
