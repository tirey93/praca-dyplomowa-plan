using Microsoft.EntityFrameworkCore.Migrations;

namespace WebSchedule.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InsertDefaultSessions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 1, 40, 0);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 2, 41, 0);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 3, 43, 0);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 4, 46, 0);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 5, 47, 0);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 6, 49, 0);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 7, 50, 0);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 8, 2, 0); 
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 9, 3, 0); 
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 10, 5, 0);

INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 1, 10, 1);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 2, 11, 1);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 3, 13, 1);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 4, 14, 1);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 5, 15, 1);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 6, 17, 1);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 7, 19, 1);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 8, 20, 1);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 9, 23, 1);
INSERT INTO sessioningroups (GroupId, Number, WeekNumber, SpringSemester) VALUES (NULL, 10, 24, 1);
");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("TRUNCATE TABLE sessioningroups;");
        }
    }
}
