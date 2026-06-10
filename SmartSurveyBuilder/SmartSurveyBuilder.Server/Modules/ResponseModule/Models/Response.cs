using SmartSurveyBuilder.Server.Modules.SurveyModule.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartSurveyBuilder.Server.Modules.ResponseModule.Models
{
    public class Response
    {
        [Key]
        public int ResponseId { get; set; }

        public int? SurveyId { get; set; }

        [StringLength(150)]
        public string? RespondentEmail { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? SubmittedAt { get; set; }

        [InverseProperty("Response")]
        public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();

        [ForeignKey("SurveyId")]
        [InverseProperty("Responses")]
        public virtual Survey? Survey { get; set; }
    }
}
