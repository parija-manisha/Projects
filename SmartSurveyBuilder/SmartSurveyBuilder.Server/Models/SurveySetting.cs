using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SmartSurveyBuilder.Server.Models;

public partial class SurveySetting
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
