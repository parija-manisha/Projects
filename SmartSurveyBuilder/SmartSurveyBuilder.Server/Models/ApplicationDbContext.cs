using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SmartSurveyBuilder.Server.Models;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Answer> Answers { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Option> Options { get; set; }

    public virtual DbSet<Question> Questions { get; set; }

    public virtual DbSet<QuestionLogic> QuestionLogics { get; set; }

    public virtual DbSet<Report> Reports { get; set; }

    public virtual DbSet<Response> Responses { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Survey> Surveys { get; set; }

    public virtual DbSet<SurveySetting> SurveySettings { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=localhost;Database=SmartSurveyBuilder;User Id=sa;Password=Temp@1234;TrustServerCertificate=True;Encrypt=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Answer>(entity =>
        {
            entity.HasKey(e => e.AnswerId).HasName("PK__Answers__D48250045FF4E766");

            entity.HasOne(d => d.Question).WithMany(p => p.Answers).HasConstraintName("FK__Answers__Questio__6E01572D");

            entity.HasOne(d => d.Response).WithMany(p => p.Answers).HasConstraintName("FK__Answers__Respons__6D0D32F4");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E12A7A5E79F");

            entity.Property(e => e.IsRead).HasDefaultValue(false);
            entity.Property(e => e.SentAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.User).WithMany(p => p.Notifications).HasConstraintName("FK__Notificat__UserI__72C60C4A");
        });

        modelBuilder.Entity<Option>(entity =>
        {
            entity.HasKey(e => e.OptionId).HasName("PK__Options__92C7A1FF38260CDF");

            entity.HasOne(d => d.Question).WithMany(p => p.Options).HasConstraintName("FK__Options__Questio__628FA481");
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.QuestionId).HasName("PK__Question__0DC06FAC4265F3EE");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsRequired).HasDefaultValue(false);

            entity.HasOne(d => d.Survey).WithMany(p => p.Questions).HasConstraintName("FK__Questions__Surve__5FB337D6");
        });

        modelBuilder.Entity<QuestionLogic>(entity =>
        {
            entity.HasKey(e => e.LogicId).HasName("PK__Question__4A718C1DCB0A58AA");

            entity.HasOne(d => d.SourceQuestion).WithMany(p => p.QuestionLogicSourceQuestions).HasConstraintName("FK__QuestionL__Sourc__656C112C");

            entity.HasOne(d => d.TargetQuestion).WithMany(p => p.QuestionLogicTargetQuestions).HasConstraintName("FK__QuestionL__Targe__66603565");
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__Reports__D5BD48055963D08B");

            entity.Property(e => e.GeneratedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Survey).WithMany(p => p.Reports).HasConstraintName("FK__Reports__SurveyI__76969D2E");
        });

        modelBuilder.Entity<Response>(entity =>
        {
            entity.HasKey(e => e.ResponseId).HasName("PK__Response__1AAA646C7E78E5FF");

            entity.Property(e => e.SubmittedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Survey).WithMany(p => p.Responses).HasConstraintName("FK__Responses__Surve__6A30C649");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Roles__8AFACE1A05DEE2D2");
        });

        modelBuilder.Entity<Survey>(entity =>
        {
            entity.HasKey(e => e.SurveyId).HasName("PK__Surveys__A5481F7DA88FA9E8");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsPublished).HasDefaultValue(false);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Surveys).HasConstraintName("FK__Surveys__Created__5441852A");
        });

        modelBuilder.Entity<SurveySetting>(entity =>
        {
            entity.HasKey(e => e.SettingId).HasName("PK__SurveySe__54372B1D8C5504F7");

            entity.Property(e => e.AllowMultipleResponses).HasDefaultValue(false);
            entity.Property(e => e.RequireLogin).HasDefaultValue(false);
            entity.Property(e => e.ShowProgressBar).HasDefaultValue(true);
            entity.Property(e => e.ShuffleQuestions).HasDefaultValue(false);

            entity.HasOne(d => d.Survey).WithMany(p => p.SurveySettings).HasConstraintName("FK__SurveySet__Surve__5AEE82B9");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C047EFDF8");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
