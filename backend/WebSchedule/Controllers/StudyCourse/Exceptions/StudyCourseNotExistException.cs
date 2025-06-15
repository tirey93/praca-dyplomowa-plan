namespace WebSchedule.Controllers.StudyCourse.Exceptions
{
    public class StudyCourseNotExistException : ApplicationException
    {
        public StudyCourseNotExistException(int id) : base("ExceptionStudyCourseNotExist", id.ToString())
        {
        }
    }
}
