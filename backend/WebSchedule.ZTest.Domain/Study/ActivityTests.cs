using FluentAssertions;
using Moq;
using WebSchedule.Domain.Entities.Study;

namespace WebSchedule.ZTest.Domain.Study
{
    public class ActivityTests
    {
        private readonly Activity _activity;

        public ActivityTests()
        {
            var sessionMock = new Mock<Session>();
            _activity = new Activity(sessionMock.Object, "name", "teacher", 14, 2);
        }

        [Theory]
        [InlineData(13, 2)]
        public void IsOverlapping_Should_BeTrue(int startingHour, int duration)
        {
            var result = _activity.IsOverlapping(startingHour, duration);

            result.Should().BeTrue();
        }

        [Theory]
        [InlineData(13, 2)]
        public void IsOverlapping_Should_BeFalse(int startingHour, int duration)
        {
            var result = _activity.IsOverlapping(startingHour, duration);

            result.Should().BeFalse();
        }
    }
}
