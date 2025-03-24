
namespace WebSchedule.Domain.Entities.Study
{
    public class Group : Entity
    {
        public int StartingYear { get; private set; }
        public StudyMode StudyMode { get; private set; }
        public StudyLevel StudyLevel { get; private set; }
        public Major Major { get; private set; }

        public HashSet<User> Students { get; private set; } = [];
        public HashSet<User> Admins { get; private set; } = [];

        public string Name => $"{StartingYear}{(char)StudyMode}{(char)StudyLevel} - {Major.ShortName}";


        public Group(int startingYear, StudyMode studyMode, StudyLevel studyLevel, Major major, User admin)
        {
            StartingYear = startingYear;
            StudyMode = studyMode;
            StudyLevel = studyLevel;
            Major = major;
            AddAdmin(admin);
        }

        public void AddStudent(User student)
        {
            Students.Add(student);
        }

        public void RemoveStudent(User student)
        {
            Students.Remove(student);
        }

        public void AddAdmin(User admin)
        {
            Admins.Add(admin);
        }

        public void RemoveAdmin(User admin)
        {
            Admins.Remove(admin);
        }
    }
}
