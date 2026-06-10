using Microsoft.EntityFrameworkCore;

namespace SmartSurveyBuilder.Server.Data
{
    public class ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options) : DbContext(options)
    {
    }
}