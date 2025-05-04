
namespace WebSchedule.Domain.Entities.Study
{
    public class UserInGroup : Entity
    {
        public User User { get; private set; }
        public int UserId { get; private set; }

        public Group Group { get; private set; }
        public int GroupId { get; private set; }

        public UserRole UserRole { get; private set; }

        protected UserInGroup() { }
        public UserInGroup(Group group, User user, UserRole userRole)
        {
            User = user;
            UserId = user.Id;
            Group = group;
            GroupId = group.Id;
            UserRole = userRole;
        }

        public void ChangeRole(UserRole role)
        {
            UserRole = role;
        }
    }
}
