using Microsoft.EntityFrameworkCore;
using SmartSurveyBuilder.Server.Data;
using SmartSurveyBuilder.Server.Modules.AuthModule.Models;
using SmartSurveyBuilder.Server.Modules.UserModule.Interfaces;
using SmartSurveyBuilder.Server.Modules.UserModule.Models;

namespace SmartSurveyBuilder.Server.Modules.UserModule.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _applicationDbContext;

        public UserRepository(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _applicationDbContext.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<int> AddAsync(User user)
        {
            await _applicationDbContext.Users.AddAsync(user);
            await _applicationDbContext.SaveChangesAsync();
            return user.UserId;
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _applicationDbContext.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.UserId == id);
        }

        public async Task<int> UpdateAsync(User user)
        {
            _applicationDbContext.Users.Update(user);

            await _applicationDbContext.SaveChangesAsync();

            return user.UserId;
        }

        public async Task<int> AddUserProfileAsync(UserProfile profile)
        {
            await _applicationDbContext.UserProfiles
                .AddAsync(profile);

            await _applicationDbContext.SaveChangesAsync();

            return profile.ProfileId;
        }
    }
}
