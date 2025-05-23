
using System.ComponentModel.DataAnnotations.Schema;
using WebSchedule.Domain.Exceptions;

namespace WebSchedule.Domain.Entities.Study
{
    public class Group : Entity
    {
        public int StartingYear { get; private set; }
        public StudyMode StudyMode { get; private set; }
        public StudyLevel StudyLevel { get; private set; }
        public StudyCourse StudyCourse { get; private set; }
        public int Subgroup { get; private set; }

        public ICollection<UserInGroup> MembersInGroup { get; private set; }

        [NotMapped]
        public IEnumerable<User> Members => MembersInGroup.Select(x => x.User);
        [NotMapped]
        public IEnumerable<User> Candidates => MembersInGroup.Where(x => x.UserRole == UserRole.Candidate).Select(x => x.User);
        [NotMapped]
        public IEnumerable<User> Students => MembersInGroup.Where(x => x.UserRole == UserRole.Student).Select(x => x.User);
        [NotMapped]
        public IEnumerable<User> Admins => MembersInGroup.Where(x => x.UserRole == UserRole.Admin).Select(x => x.User);

        protected Group() {}
        public Group(int startingYear, StudyMode studyMode, StudyLevel studyLevel, StudyCourse studyCourse, User admin, int subgroup)
        {
            MembersInGroup = [];
            StartingYear = startingYear;
            StudyMode = studyMode;
            StudyLevel = studyLevel;
            StudyCourse = studyCourse;
            Subgroup = subgroup;
            AddCandidate(admin);
            MakeAdmin(admin);
        }

        public void AddCandidate(User candidate)
        {
            if (Candidates.Contains(candidate))
                throw new CandidateAlreadyInAGroupException(candidate.Id, Id);
            MembersInGroup.Add(new UserInGroup(this, candidate, UserRole.Candidate));
        }

        public void MakeStudent(User candidate)
        {
            if (!Candidates.Contains(candidate))
                throw new NoSuchCandidateInGroupException(candidate.Id, Id);
            if (Students.Contains(candidate))
                throw new CandidateAlreadyInAGroupException(candidate.Id, Id);

            MembersInGroup.First(x => x.User.Equals(candidate)).ChangeRole(UserRole.Student);
        }

        public void MakeAdmin(User candidate)
        {
            if (!Candidates.Contains(candidate))
                throw new NoSuchCandidateInGroupException(candidate.Id, Id);
            if (Admins.Contains(candidate))
                throw new CandidateAlreadyInAGroupException(candidate.Id, Id);

            MembersInGroup.First(x => x.User.Equals(candidate)).ChangeRole(UserRole.Admin);
        }

        public void RemoveMember(User member)
        {
            if (!Members.Contains(member))
                throw new NoSuchMemberInGroupException(member.Id, Id);
            var userInGroup = MembersInGroup.First(x => x.User == member);
            MembersInGroup.Remove(userInGroup);
        }
    }
}
