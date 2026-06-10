using SmartSurveyBuilder.Server.Modules.AnalyticsModule.Models;
using SmartSurveyBuilder.Server.Modules.AuthModule.Models;
using SmartSurveyBuilder.Server.Modules.QuestionModule.Models;
using SmartSurveyBuilder.Server.Modules.ResponseModule.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartSurveyBuilder.Server.Modules.SurveyModule.Models
{
    public class Survey
    {
        [Key]
        public int SurveyId { get; set; }

        [StringLength(200)]
        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        public int? CreatedBy { get; set; }

        public bool? IsPublished { get; set; }

        public bool? IsActive { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? StartDate { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? EndDate { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? CreatedAt { get; set; }

        [ForeignKey("CreatedBy")]
        [InverseProperty("Surveys")]
        public virtual User CreatedByNavigation { get; set; }

        [InverseProperty("Survey")]
        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();

        [InverseProperty("Survey")]
        public virtual ICollection<Report> Reports { get; set; } = new List<Report>();

        [InverseProperty("Survey")]
        public virtual ICollection<Response> Responses { get; set; } = new List<Response>();

        [InverseProperty("Survey")]
        public virtual ICollection<SurveySettings> SurveySettings { get; set; } = new List<SurveySettings>();
    }
}
