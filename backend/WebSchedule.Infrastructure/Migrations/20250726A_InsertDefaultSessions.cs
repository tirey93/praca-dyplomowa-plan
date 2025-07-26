using Microsoft.EntityFrameworkCore.Migrations;

namespace WebSchedule.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InsertDefaultSessions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 1, 40);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 2, 41);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 3, 43);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 4, 46);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 5, 47);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 6, 49);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 7, 50);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 8, 2); 
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 9, 3); 
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 10, 5);

INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 1, 10);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 2, 11);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 3, 13);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 4, 14);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 5, 15);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 6, 17);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 7, 19);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 8, 20);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 9, 23);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber) VALUES (NULL, 10, 24);
");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("TRUNCATE TABLE sessioningroups;");
        }
    }
}
