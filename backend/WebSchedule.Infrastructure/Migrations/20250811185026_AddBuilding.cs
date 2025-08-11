using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace WebSchedule.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBuilding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BuildingId",
                table: "Activities",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Buildings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: true),
                    Link = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Buildings", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_BuildingId",
                table: "Activities",
                column: "BuildingId");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_Buildings_BuildingId",
                table: "Activities",
                column: "BuildingId",
                principalTable: "Buildings",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_Buildings_BuildingId",
                table: "Activities");

            migrationBuilder.DropTable(
                name: "Buildings");

            migrationBuilder.DropIndex(
                name: "IX_Activities_BuildingId",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "BuildingId",
                table: "Activities");
        }
    }
}
