using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartSurveyBuilder.Server.Modules.AuthModule.Models
{
    public class RefreshToken
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [StringLength(500)]
        public string Token { get; set; } = null!;

        [Column(TypeName = "datetime")]
        public DateTime ExpiryDate { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        public bool IsRevoked { get; set; }

        public virtual User User { get; set; } = null!;
    }
}
