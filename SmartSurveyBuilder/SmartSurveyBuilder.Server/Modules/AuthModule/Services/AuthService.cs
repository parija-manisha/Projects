using SmartSurveyBuilder.Server.Modules.AuthModule.DTOs;
using SmartSurveyBuilder.Server.Modules.AuthModule.Interfaces;
using SmartSurveyBuilder.Server.Modules.AuthModule.Models;
using SmartSurveyBuilder.Server.Modules.AuthModule.Respositories;
using System.Security.Claims;

namespace SmartSurveyBuilder.Server.Modules.AuthModule.Services
{
    public class AuthService : IAuthService
    {
        private readonly AuthRepository _authRepository;
        private readonly PasswordService _passwordService;
        private readonly JwtService _jwtService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            AuthRepository authRepository,
            PasswordService passwordService,
            JwtService jwtService,
            ILogger<AuthService> logger)
        {
            _authRepository = authRepository;
            _passwordService = passwordService;
            _jwtService = jwtService;
            _logger = logger;
        }

        public async Task<TokenDto> LoginAsync(LoginDto loginDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
                {
                    throw new UnauthorizedAccessException("Email and password are required");
                }

                var user = await _authRepository.GetUserByEmailAsync(loginDto.Email);

                if (user == null)
                {
                    _logger.LogWarning($"Login attempt with non-existent email: {loginDto.Email}");
                    throw new UnauthorizedAccessException("Invalid email or password");
                }

                if (user.IsActive == false)
                {
                    _logger.LogWarning($"Login attempt with inactive user: {user.UserId}");
                    throw new UnauthorizedAccessException("User account is inactive");
                }

                if (!_passwordService.VerifyPassword(loginDto.Password, user.PasswordHash))
                {
                    _logger.LogWarning($"Failed login attempt for user: {user.UserId}");
                    throw new UnauthorizedAccessException("Invalid email or password");
                }

                var accessToken = _jwtService.GenerateAccessToken(user);
                var refreshToken = _jwtService.GenerateRefreshToken();
                var refreshTokenExpirationDays = _jwtService.GetRefreshTokenExpirationDays();

                var refreshTokenEntity = new RefreshToken
                {
                    UserId = user.UserId,
                    Token = refreshToken,
                    ExpiryDate = DateTime.UtcNow.AddDays(refreshTokenExpirationDays),
                    CreatedAt = DateTime.UtcNow,
                    IsRevoked = false
                };

                await _authRepository.CreateRefreshTokenAsync(refreshTokenEntity);

                _logger.LogInformation($"User logged in successfully: {user.UserId}");

                return new TokenDto
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    ExpiresIn = 900, // 15 minutes in seconds
                    TokenType = "Bearer",
                    User = new AuthUserDto
                    {
                        Id = user.UserId,
                        Email = user.Email
                    }
                };
            }
            catch (UnauthorizedAccessException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error during login: {ex.Message}");
                throw new Exception("An error occurred during login");
            }
        }

        public async Task<TokenDto> RegisterAsync(RegisterDto registerDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(registerDto.Email) || string.IsNullOrWhiteSpace(registerDto.Password))
                {
                    throw new ArgumentException("Email and password are required");
                }

                if (!_passwordService.IsStrongPassword(registerDto.Password))
                {
                    throw new ArgumentException("Password must be at least 8 characters and contain uppercase, lowercase, digit, and special character");
                }

                if (await _authRepository.EmailExistsAsync(registerDto.Email))
                {
                    _logger.LogWarning($"Registration attempt with existing email: {registerDto.Email}");
                    throw new InvalidOperationException("Email already exists");
                }

                var user = new User
                {
                    Email = registerDto.Email.ToLower().Trim(),
                    PasswordHash = _passwordService.HashPassword(registerDto.Password),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                user = await _authRepository.CreateUserAsync(user);

                var accessToken = _jwtService.GenerateAccessToken(user);
                var refreshToken = _jwtService.GenerateRefreshToken();
                var refreshTokenExpirationDays = _jwtService.GetRefreshTokenExpirationDays();

                var refreshTokenEntity = new RefreshToken
                {
                    UserId = user.UserId,
                    Token = refreshToken,
                    ExpiryDate = DateTime.UtcNow.AddDays(refreshTokenExpirationDays),
                    CreatedAt = DateTime.UtcNow,
                    IsRevoked = false
                };

                await _authRepository.CreateRefreshTokenAsync(refreshTokenEntity);

                _logger.LogInformation($"User registered successfully: {user.UserId}");

                return new TokenDto
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    ExpiresIn = 900,
                    TokenType = "Bearer",
                    User = new AuthUserDto
                    {
                        Id = user.UserId,
                        Email = user.Email
                    }
                };
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (InvalidOperationException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error during registration: {ex.Message}");
                throw new Exception("An error occurred during registration");
            }
        }

        public async Task<TokenDto> RefreshTokenAsync(string refreshToken)
        {
            try
            {
                var storedRefreshToken = await _authRepository.GetRefreshTokenAsync(refreshToken);

                if (storedRefreshToken == null)
                {
                    throw new UnauthorizedAccessException("Invalid or expired refresh token");
                }

                var user = await _authRepository.GetUserByIdAsync(storedRefreshToken.UserId);

                if (user == null || user.IsActive == false)
                {
                    throw new UnauthorizedAccessException("User not found or inactive");
                }

                var accessToken = _jwtService.GenerateAccessToken(user);
                var newRefreshToken = _jwtService.GenerateRefreshToken();
                var refreshTokenExpirationDays = _jwtService.GetRefreshTokenExpirationDays();

                // Revoke old refresh token
                await _authRepository.RevokeRefreshTokenAsync(refreshToken);

                // Create new refresh token
                var newRefreshTokenEntity = new RefreshToken
                {
                    UserId = user.UserId,
                    Token = newRefreshToken,
                    ExpiryDate = DateTime.UtcNow.AddDays(refreshTokenExpirationDays),
                    CreatedAt = DateTime.UtcNow,
                    IsRevoked = false
                };

                await _authRepository.CreateRefreshTokenAsync(newRefreshTokenEntity);

                return new TokenDto
                {
                    AccessToken = accessToken,
                    RefreshToken = newRefreshToken,
                    ExpiresIn = 900,
                    TokenType = "Bearer",
                    User = new AuthUserDto
                    {
                        Id = user.UserId,
                        Email = user.Email
                    }
                };
            }
            catch (UnauthorizedAccessException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error during token refresh: {ex.Message}");
                throw new Exception("An error occurred during token refresh");
            }
        }

        public async Task LogoutAsync(int userId)
        {
            try
            {
                await _authRepository.RevokeAllUserTokensAsync(userId);
                _logger.LogInformation($"User logged out: {userId}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error during logout: {ex.Message}");
                throw new Exception("An error occurred during logout");
            }
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                var principal = _jwtService.GetPrincipalFromExpiredToken(token);
                return principal != null;
            }
            catch
            {
                return false;
            }
        }
    }
}
