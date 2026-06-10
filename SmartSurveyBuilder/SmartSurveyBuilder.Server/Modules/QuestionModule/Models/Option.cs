using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartSurveyBuilder.Server.Modules.QuestionModule.Models
{
    public class Option
    {
        [Key]
        public int OptionId { get; set; }

        public int? QuestionId { get; set; }

        [StringLength(300)]
        public string? OptionText { get; set; }

        public int? OrderIndex { get; set; }

        [ForeignKey("QuestionId")]
        [InverseProperty("Options")]
        public virtual Question? Question { get; set; }
    }
}
