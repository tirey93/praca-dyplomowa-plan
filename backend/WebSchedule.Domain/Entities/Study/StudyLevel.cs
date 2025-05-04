
namespace WebSchedule.Domain.Entities.Study
{
    public enum StudyLevel
    {
        Bachelor,
        Master,
        Engineer
    }

    public static class StudyLevelExtensions
    {
        public static string ToShort(this StudyLevel level)
        {
            return level switch
            {
                StudyLevel.Bachelor => "L",
                StudyLevel.Master => "M",
                StudyLevel.Engineer => "I",
                _ => "?",
            };
        }
    }
}
