using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSchedule.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameToRoom : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE Activities CHANGE Location Room longtext;");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE Activities CHANGE Room Location longtext;");
        }
    }
}
