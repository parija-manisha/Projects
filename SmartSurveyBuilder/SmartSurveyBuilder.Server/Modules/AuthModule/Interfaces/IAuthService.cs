using SmartSurveyBuilder.Server.Modules.AuthModule.DTOs;

namespace SmartSurveyBuilder.Server.Modules.AuthModule.Interfaces
{
    public interface IAuthService
    {
        Task<TokenDto> LoginAsync(LoginDto loginDto);
        Task<TokenDto> RegisterAsync(RegisterDto registerDto);
        Task<TokenDto> RefreshTokenAsync(string refreshToken);
        Task LogoutAsync(int userId);
        Task<bool> ValidateTokenAsync(string token);
    }
}
