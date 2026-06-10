namespace SmartSurveyBuilder.Server.Modules.UserModule.DTOs
{
    public class UserDto
    {
        public int UserId { get; set; }

        public string Email { get; set; }

        public int? RoleId { get; set; }

        public bool? IsActive { get; set; }
    }
}