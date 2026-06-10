using SmartSurveyBuilder.Server.Modules.NotificationModule.Models;
using SmartSurveyBuilder.Server.Modules.SurveyModule.Models;
using SmartSurveyBuilder.Server.Modules.UserModule.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartSurveyBuilder.Server.Modules.AuthModule.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        [StringLength(150)]
        public string Email { get; set; } = null!;
        [StringLength(500)]
        public string PasswordHash { get; set; } = null!;
        public int? RoleId { get; set; }
        public bool? IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedAt { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedAt { get; set; }
        [InverseProperty("User")]
        public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        [InverseProperty("CreatedByNavigation")]
        public virtual ICollection<Survey> Surveys { get; set; } = [];
        public virtual UserProfile UserProfile { get; set; }
    }
}
