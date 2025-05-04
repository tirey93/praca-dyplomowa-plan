
namespace WebSchedule.Domain.Entities.Study
{
    public enum StudyMode
    {
        FullTime,
        PartTime
    }

    public static class StudyModeExtensions 
    {
        public static string ToShort(this StudyMode mode)
        {
            return mode switch
            {
                StudyMode.FullTime => "S",
                StudyMode.PartTime => "N",
                _ => "?",
            };
        }
    }
}
