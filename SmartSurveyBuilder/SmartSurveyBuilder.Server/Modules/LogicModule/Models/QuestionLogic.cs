using SmartSurveyBuilder.Server.Modules.QuestionModule.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartSurveyBuilder.Server.Modules.LogicModule.Models
{
    public class QuestionLogic
    {
        [Key]
        public int LogicId { get; set; }

        public int? SourceQuestionId { get; set; }

        [StringLength(300)]
        public string? ExpectedAnswer { get; set; }

        [StringLength(50)]
        public string? OperatorType { get; set; }

        public int? TargetQuestionId { get; set; }

        [StringLength(50)]
        public string? ActionType { get; set; }

        [ForeignKey("SourceQuestionId")]
        [InverseProperty("QuestionLogicSourceQuestions")]
        public virtual Question? SourceQuestion { get; set; }

        [ForeignKey("TargetQuestionId")]
        [InverseProperty("QuestionLogicTargetQuestions")]
        public virtual Question? TargetQuestion { get; set; }
    }
}
