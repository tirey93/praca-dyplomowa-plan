namespace WebSchedule.Controllers.StudyCourse.Exceptions
{
    public class StudyCourseNameExistsException : ApplicationException
    {
        public StudyCourseNameExistsException(string studyCourseName) : base("ExceptionStudyCourseNameAlreadyExists", studyCourseName)
        {
        }
    }
}
