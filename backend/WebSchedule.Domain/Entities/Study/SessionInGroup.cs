

namespace WebSchedule.Domain.Entities.Study
{
    public class SessionInGroup : Entity
    {
        public Group Group { get; private set; }
        public int? GroupId { get; private set; }

        public int Number { get; set; }
        public int WeekNumber { get; set; }

        public bool SpringSemester { get; set; }

        public SessionInGroup() { }

        public SessionInGroup(Group group, int number, int weekNumber)
        {
            Group = group;
            GroupId = group.Id;
            Number = number;
            WeekNumber = weekNumber;
        }
    }
}
