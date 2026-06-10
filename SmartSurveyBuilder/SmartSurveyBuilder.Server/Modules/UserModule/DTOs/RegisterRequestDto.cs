using SmartSurveyBuilder.Server.Modules.AuthModule.DTOs;

namespace SmartSurveyBuilder.Server.Modules.UserModule.DTOs
{
    public class RegisterRequestDto
    {
        public RegisterDto RegisterDto { get; set; }

        public ProfileDto ProfileDto { get; set; }
    }
}
