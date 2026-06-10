namespace SmartSurveyBuilder.Server.Modules.AuthModule.DTOs
{
    public class TokenDto
    {
        public string AccessToken { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
        public int ExpiresIn { get; set; }
        public string TokenType { get; set; } = "Bearer";
        public AuthUserDto User { get; set; } = null!;
    }

    public class AuthUserDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
    }
}
