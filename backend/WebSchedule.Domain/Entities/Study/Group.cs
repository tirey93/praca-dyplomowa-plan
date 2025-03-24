using WebSchedule.Domain.Exceptions;

namespace WebSchedule.Domain.Entities.Study
{
    public class Group : Entity
    {
        public int StartingYear { get; set; }
        public StudyMode StudyMode { get; set; }
        public StudyLevel StudyLevel { get; set; }
        public Major Major { get; set; }

        public HashSet<User> Students { get; private set; } = [];
        public HashSet<User> Admins { get; private set; } = [];

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
            if (!Students.Contains(admin))
            {
                throw new UserNotBelongToTheGroupException(admin.Id, ToString());
            }

            Admins.Add(admin);
        }

        public void RemoveAdmin(User admin)
        {
            if (admin.Role != Role.Admin)
            {
                throw new UserNotAnAdminException(admin.Id);
            }

            Admins.Remove(admin);
        }

        public override string ToString()
        {
            return $"{StartingYear}{(char)StudyMode}{(char)StudyLevel} - {Major.ShortName}";
        }
    }
}
