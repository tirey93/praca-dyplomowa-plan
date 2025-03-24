using FluentAssertions;
using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.ZTest.Domain.Study
{
    public class GroupTests
    {
        [Fact]
        public void ToString_ShouldSuccess()
        {
            var group = new Group
            {
                StartingYear = 2015,
                Major = new Major { ShortName = "ABC" },
                StudyLevel = StudyLevel.Bachelor,
                StudyMode = StudyMode.PartTime
            };

            var result = group.ToString();

            result.Should().Be("2015NL - ABC");
        }
    }
}
