using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebSchedule.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveStudyMode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StudyMode",
                table: "Groups");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StudyMode",
                table: "Groups",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
