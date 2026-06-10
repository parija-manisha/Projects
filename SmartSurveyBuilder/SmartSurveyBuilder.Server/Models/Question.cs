using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SmartSurveyBuilder.Server.Models;

public partial class Question
{
    [Key]
    public int QuestionId { get; set; }

    public int? SurveyId { get; set; }

    public string QuestionText { get; set; } = null!;

    [StringLength(50)]
    public string? QuestionType { get; set; }

    public bool? IsRequired { get; set; }

    public int? OrderIndex { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    [InverseProperty("Question")]
    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();

    [InverseProperty("Question")]
    public virtual ICollection<Option> Options { get; set; } = new List<Option>();

    [InverseProperty("SourceQuestion")]
    public virtual ICollection<QuestionLogic> QuestionLogicSourceQuestions { get; set; } = new List<QuestionLogic>();

    [InverseProperty("TargetQuestion")]
    public virtual ICollection<QuestionLogic> QuestionLogicTargetQuestions { get; set; } = new List<QuestionLogic>();

    [ForeignKey("SurveyId")]
    [InverseProperty("Questions")]
    public virtual Survey? Survey { get; set; }
}
