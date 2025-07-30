

namespace WebSchedule.Domain.Entities.Study
{
    public class SessionInGroup : Entity
    {
        public Group Group { get; private set; }
        public int? GroupId { get; private set; }

        public int Number { get; private set; }
        public int WeekNumber { get; private set; }

        public bool SpringSemester { get; private set; }

        //public ICollection<Activity> Activities { get; set; } = [];

        public SessionInGroup() { }

        public SessionInGroup(Group group, int number, int weekNumber, bool springSemester)
        {
            Group = group;
            GroupId = group.Id;
            Number = number;
            WeekNumber = weekNumber;
            SpringSemester = springSemester;
        }

        public void UpdateWeek(int newWeekNumber)
        {
            WeekNumber = newWeekNumber;
        }
    }
}
