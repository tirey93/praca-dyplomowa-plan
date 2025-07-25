
namespace WebSchedule.Domain.Dtos
{
    public class GroupDto
    {
        public int Id { get; set; }
        public int StartingYear { get; set; }
        public string StudyCourseName { get; set; }
        public string StudyCourseShort { get; set; }
        public string StudyLevel { get; set; }
        public int Subgroup { get; set; }
    }
}
