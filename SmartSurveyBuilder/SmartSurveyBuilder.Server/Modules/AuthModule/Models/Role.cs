using System.ComponentModel.DataAnnotations;

namespace SmartSurveyBuilder.Server.Modules.AuthModule.Models
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }

        [StringLength(50)]
        public string RoleName { get; set; } = null!;
    }
}
