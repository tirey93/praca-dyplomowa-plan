
using WebSchedule.Domain.Exceptions;

namespace WebSchedule.Domain.Entities.Study
{
    public class Group : Entity
    {
        public int StartingYear { get; private set; }
        public StudyMode StudyMode { get; private set; }
        public StudyLevel StudyLevel { get; private set; }
        public StudyCourse StudyCourse { get; private set; }

        public HashSet<User> Students { get; private set; } = [];
        public HashSet<User> Admins { get; private set; } = [];
        public HashSet<User> Candidates { get; private set; } = [];

        public string Name => $"{StartingYear}{(char)StudyMode}{(char)StudyLevel} - {StudyCourse.ShortName}";


        public Group(int startingYear, StudyMode studyMode, StudyLevel studyLevel, StudyCourse studyCourse, User admin)
        {
            StartingYear = startingYear;
            StudyMode = studyMode;
            StudyLevel = studyLevel;
            StudyCourse = studyCourse;
            AddAdmin(admin);
        }

        public void AddCandidate(User candidate)
        {
            if (Candidates.Contains(candidate))
                throw new CandidateAlreadyInAGroupException(candidate.Id, Id);
            Candidates.Add(candidate);
        }

        public void MakeStudent(User candidate)
        {
            if (!Candidates.Contains(candidate))
                throw new NoSuchCandidateInGroupException(candidate.Id, Id);
            if (Students.Contains(candidate))
                throw new CandidateAlreadyInAGroupException(candidate.Id, Id);
            Candidates.Remove(candidate);
            Students.Add(candidate);
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
