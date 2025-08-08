
namespace WebSchedule.Domain.Entities.Study
{
    public class Activity : Entity
    {
        public string Name { get; private set; }
        public string TeacherFullName { get; private set; }
        public string Location { get; private set; }
        public int StartingHour { get; private set; }
        public int Duration { get; private set; }
        public WeekDay WeekDay { get; private set; }
        public Session Session { get; private set; }
        public int SessionId { get; private set; }

        public Activity() { }

        public Activity(Session session, string name, string teacherFullName, int startingHour, int duration, WeekDay weekDay, string location)
        {
            Session = session;
            SessionId = Session.Id;
            Name = name;
            TeacherFullName = teacherFullName;
            StartingHour = startingHour;
            Duration = duration;
            WeekDay = weekDay;
            Location = location;
        }

        public bool IsOverlapping(int startingHour, int duration)
        {
            int currentActivityEnd = StartingHour + Duration;
            int newActivityEnd = startingHour + duration;

            return startingHour < currentActivityEnd && newActivityEnd > StartingHour;
        }

        public void SetName(string name)
        {
            Name = name;
        }

        public void SetTeachFullName(string teacherFullName)
        {
            TeacherFullName = teacherFullName;
        }

        public void SetStartingHour(int startingHour)
        {
            StartingHour = startingHour;
        }

        public void SetDuration(int duration)
        {
            Duration = duration;
        }

        public void SetWeekDay(WeekDay weekDay)
        {
            WeekDay = weekDay;
        }

        public void SetLocation(string location)
        {
            Location = location;
        }
    }
}
