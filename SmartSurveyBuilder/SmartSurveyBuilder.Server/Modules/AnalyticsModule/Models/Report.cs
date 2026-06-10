using SmartSurveyBuilder.Server.Modules.SurveyModule.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartSurveyBuilder.Server.Modules.AnalyticsModule.Models
{
    public class Report
    {
        [Key]
        public int ReportId { get; set; }

        public int? SurveyId { get; set; }

        [StringLength(300)]
        public string? FileName { get; set; }

        public string? FilePath { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? GeneratedAt { get; set; }

        [ForeignKey("SurveyId")]
        [InverseProperty("Reports")]
        public virtual Survey Survey { get; set; }
    }
}
