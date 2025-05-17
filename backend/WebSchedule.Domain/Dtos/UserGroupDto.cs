
namespace WebSchedule.Domain.Dtos
{
    public class UserGroupDto
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int StartingYear { get; set; }
        public string StudyCourseName { get; set; }
        public string StudyCourseShort { get; set; }
        public string StudyLevel { get; set; }
        public string StudyMode { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsCandidate { get; set; }
    }
}
