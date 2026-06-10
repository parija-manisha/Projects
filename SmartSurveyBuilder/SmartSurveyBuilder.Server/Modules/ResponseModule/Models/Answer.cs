using SmartSurveyBuilder.Server.Modules.QuestionModule.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartSurveyBuilder.Server.Modules.ResponseModule.Models
{
    public class Answer
    {
        [Key]
        public int AnswerId { get; set; }

        public int? ResponseId { get; set; }

        public int? QuestionId { get; set; }

        public string? AnswerText { get; set; }

        [ForeignKey("QuestionId")]
        [InverseProperty("Answers")]
        public virtual Question Question { get; set; }

        [ForeignKey("ResponseId")]
        [InverseProperty("Answers")]
        public virtual Response Response { get; set; }
    }
}
