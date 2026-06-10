using SmartSurveyBuilder.Server.Modules.AuthModule.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartSurveyBuilder.Server.Modules.NotificationModule.Models
{
    public class Notification
    {
        [Key]
        public int NotificationId { get; set; }

        public int? UserId { get; set; }

        [StringLength(200)]
        public string? Title { get; set; }

        public string? Message { get; set; }

        public bool? IsRead { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? SentAt { get; set; }

        [ForeignKey("UserId")]
        [InverseProperty("Notifications")]
        public virtual User User { get; set; }
    }
}
