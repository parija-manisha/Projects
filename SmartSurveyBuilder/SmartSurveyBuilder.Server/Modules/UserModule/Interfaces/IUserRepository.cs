using SmartSurveyBuilder.Server.Modules.AuthModule.Models;
using SmartSurveyBuilder.Server.Modules.UserModule.Models;

namespace SmartSurveyBuilder.Server.Modules.UserModule.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);

        Task<User?> GetByIdAsync(int id);

        Task<int> AddAsync(User user);

        Task<int> UpdateAsync(User user);

        Task<int> AddUserProfileAsync(UserProfile profile);
    }
}
