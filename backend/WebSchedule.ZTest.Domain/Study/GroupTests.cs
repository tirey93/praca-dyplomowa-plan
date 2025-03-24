using FluentAssertions;
using WebSchedule.Domain.Entities;
using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.ZTest.Domain.Study
{
    public class GroupTests
    {
        [Fact]
        public void ToString_ShouldSuccess()
        {
            var group = new Group(2015, StudyMode.PartTime, StudyLevel.Bachelor, new Major { ShortName = "ABC" }, new User());

            group.Name.Should().Be("2015NL - ABC");
        }
    }
}
