using Microsoft.EntityFrameworkCore.Migrations;

namespace WebSchedule.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameSessions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"ALTER TABLE sessioningroups RENAME TO sessions");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE sessions RENAME TO sessioningroups;");
        }
    }
}
