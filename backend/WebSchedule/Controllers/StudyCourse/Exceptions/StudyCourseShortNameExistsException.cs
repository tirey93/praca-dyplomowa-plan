namespace WebSchedule.Controllers.StudyCourse.Exceptions
{
    public class StudyCourseShortNameExistsException : ApplicationException
    {
        public StudyCourseShortNameExistsException(string studyCourseShortName) : base("ExceptionStudyCourseShortNameAlreadyExists", studyCourseShortName)
        {
        }
    }
}
