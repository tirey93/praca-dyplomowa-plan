using WebSchedule.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<UserInGroup> UserInGroups { get; set; }
        public DbSet<StudyCourse> StudyCourses { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Building> Buildings { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<Activity> Activities { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
