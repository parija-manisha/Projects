using BCrypt.Net;
using Mapster;
using SmartSurveyBuilder.Server.Modules.AuthModule.DTOs;
using SmartSurveyBuilder.Server.Modules.AuthModule.Models;
using SmartSurveyBuilder.Server.Modules.UserModule.DTOs;
using SmartSurveyBuilder.Server.Modules.UserModule.Interfaces;
using SmartSurveyBuilder.Server.Modules.UserModule.Models;

namespace SmartSurveyBuilder.Server.Modules.UserModule.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;

        public UserService(IUserRepository repository)
        {
            _repository = repository;
        }

        public async Task<UserDto?> GetByEmailAsync(string email)
        {
            var user = await _repository.GetByEmailAsync(email);

            return user?.Adapt<UserDto>();
        }

        public async Task<UserDto?> GetByIdAsync(int id)
        {
            var user = await _repository.GetByIdAsync(id);

            return user?.Adapt<UserDto>();
        }

        public async Task<(bool Success, string Message)>
        LoginAsync(LoginDto dto)
        {
            var user = await _repository.GetByEmailAsync(dto.Email);

            if (user == null)
                return (false, "Invalid email");

            bool validPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!validPassword)
                return (false, "Invalid password");

            return (true, "Login successful");
        }

        public async Task<(bool Success, string Message, int? UserId)> RegisterAsync(RegisterDto registerDto,
                      ProfileDto profileDto)
        {
            var existingUser = await _repository.GetByEmailAsync(registerDto.Email);

            if (existingUser != null)
                return (false, "User already exists", null);

            var user = registerDto.Adapt<User>();

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            user.CreatedAt = DateTime.UtcNow;
            user.IsActive = true;

            var userId = await _repository.AddAsync(user);

            var profile = profileDto.Adapt<UserProfile>();

            profile.UserId = userId;
            profile.CreatedAt = DateTime.UtcNow;

            await _repository.AddUserProfileAsync(profile);

            return (true, "User registered successfully", userId);
        }

        public async Task<(bool Success, string Message)> UpdateUserAsync(int id, UserDto dto)
        {
            var existingUser =  await _repository.GetByIdAsync(id);

            if (existingUser == null)
                return (false, "User not found");

            existingUser.Email = dto.Email;
            existingUser.RoleId = dto.RoleId;
            existingUser.IsActive = dto.IsActive;
            existingUser.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(existingUser);

            return (true, "User updated successfully");
        }
    }
}