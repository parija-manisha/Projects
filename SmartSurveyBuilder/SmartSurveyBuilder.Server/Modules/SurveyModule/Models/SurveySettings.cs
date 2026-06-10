using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartSurveyBuilder.Server.Modules.SurveyModule.Models
{
    public class SurveySettings
    {
        [Key]
        public int SettingId { get; set; }

        public int? SurveyId { get; set; }

        public bool? AllowMultipleResponses { get; set; }

        public bool? ShowProgressBar { get; set; }

        public bool? ShuffleQuestions { get; set; }

        public bool? RequireLogin { get; set; }

        [ForeignKey("SurveyId")]
        [InverseProperty("SurveySettings")]
        public virtual Survey? Survey { get; set; }
    }
}
