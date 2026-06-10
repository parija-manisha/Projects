namespace SmartSurveyBuilder.Server.Modules.UserModule.DTOs
{
    public class ProfileDto
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string DisplayName { get; set; }

        public string Bio { get; set; }

        public string PhoneNumber { get; set; }

        public string Gender { get; set; }

        public string Country { get; set; }

        public string State { get; set; }

        public string City { get; set; }

        public string Address { get; set; }

        public string ProfileImageUrl { get; set; }

        public string CoverImageUrl { get; set; }

        public string WebsiteUrl { get; set; }

        public string Occupation { get; set; }

        public string CompanyName { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public bool IsPublicProfile { get; set; }

        public bool EmailNotificationsEnabled { get; set; }

        public bool SmsNotificationsEnabled { get; set; }
    }
}