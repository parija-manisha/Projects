using SmartSurveyBuilder.Server.Modules.AuthModule.DTOs;
using SmartSurveyBuilder.Server.Modules.UserModule.DTOs;

namespace SmartSurveyBuilder.Server.Modules.UserModule.Interfaces
{
    public interface IUserService
    {
        Task<UserDto?> GetByEmailAsync(string email);

        Task<UserDto?> GetByIdAsync(int id);

        Task<(bool Success, string Message)>
        LoginAsync(LoginDto dto);

        Task<(bool Success, string Message, int? UserId)>
        RegisterAsync(RegisterDto registerDto, ProfileDto profileDto);

        Task<(bool Success, string Message)>
        UpdateUserAsync(int id, UserDto dto);
    }
}
