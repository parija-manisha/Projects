using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using SmartSurveyBuilder.Server.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SmartSurveyBuilder API",
        Version = "v1"
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));
var app = builder.Build();

// Swagger first
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartSurveyBuilder API v1");
});

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

// Serve React frontend
app.UseDefaultFiles();
app.UseStaticFiles();

// Important: fallback only for non-API, non-Swagger routes
app.MapFallbackToFile("/index.html");

app.Run();
