using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SmartSurveyBuilder.Server.Modules.AuthModule.Models;

namespace SmartSurveyBuilder.Server.Modules.UserModule.Models
{
    public class UserProfile
    {
        [Key]
        public int ProfileId { get; set; }

        public int UserId { get; set; }

        [StringLength(100)]
        public string FirstName { get; set; }

        [StringLength(100)]
        public string LastName { get; set; }

        [StringLength(150)]
        public string DisplayName { get; set; }

        [StringLength(200)]
        public string Bio { get; set; }

        [StringLength(20)]
        public string PhoneNumber { get; set; }

        [StringLength(10)]
        public string Gender { get; set; }

        [StringLength(100)]
        public string Country { get; set; }

        [StringLength(100)]
        public string State { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(250)]
        public string Address { get; set; }

        [StringLength(500)]
        public string ProfileImageUrl { get; set; }

        [StringLength(500)]
        public string CoverImageUrl { get; set; }

        [StringLength(200)]
        public string WebsiteUrl { get; set; }

        [StringLength(100)]
        public string Occupation { get; set; }

        [StringLength(100)]
        public string CompanyName { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public bool IsPublicProfile { get; set; }

        public bool EmailNotificationsEnabled { get; set; }

        public bool SmsNotificationsEnabled { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}