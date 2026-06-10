using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SmartSurveyBuilder.Server.Models;

public partial class Report
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
    public virtual Survey? Survey { get; set; }
}
