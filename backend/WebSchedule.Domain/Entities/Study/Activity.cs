
namespace WebSchedule.Domain.Entities.Study
{
    public class Activity : Entity
    {
        public string Name { get; private set; }
        public string TeacherFullName { get; private set; }
        public int StartingHour { get; private set; }
        public int Duration { get; private set; }
        public Session Session { get; private set; }
        public int SessionId { get; private set; }

        public Activity() { }

        public Activity(Session session, string name, string teacherFullName, int startingHour, int duration)
        {
            Session = session;
            SessionId = Session.Id;
            Name = name;
            TeacherFullName = teacherFullName;
            StartingHour = startingHour;
            Duration = duration;
        }

    }
}
