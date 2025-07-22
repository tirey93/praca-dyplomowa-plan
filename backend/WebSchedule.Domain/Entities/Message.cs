using System.Diagnostics.CodeAnalysis;
using WebSchedule.Domain.Entities.Study;
using WebSchedule.Domain.Exceptions.Message;

namespace WebSchedule.Domain.Entities
{
    public class Message : Entity
    {
        [NotNull]
        public UserInGroup UserInGroup { get; private set; }
        [NotNull]
        public string Content { get; private set; }
        public DateTime CreatedAt {  get; private set; }

        public Message() {}

        public Message(UserInGroup userInGroup, string content)
        {
            if (string.IsNullOrEmpty(content))
            {
                throw new ContentCannotBeEmptyException();
            }
            int max = 255;
            if (content.Length > max)
            {
                throw new ContentCannotBeThatLargeException(max);
            }

            UserInGroup = userInGroup;
            Content = content;
            CreatedAt = DateTime.Now;
        }
    }
}
