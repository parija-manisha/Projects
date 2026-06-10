using Microsoft.AspNetCore.Mvc;
using SmartSurveyBuilder.Server.Modules.AuthModule.DTOs;
using SmartSurveyBuilder.Server.Modules.UserModule.DTOs;
using SmartSurveyBuilder.Server.Modules.UserModule.Interfaces;

namespace SmartSurveyBuilder.Server.Modules.UserModule.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

        [HttpPost("register")]
        public async Task<IActionResult> Register(
            [FromBody] RegisterRequestDto request)
        {
            var result = await _userService.RegisterAsync(
                request.RegisterDto,
                request.ProfileDto);

            if (!result.Success)
            {
                return BadRequest(new
                {
                    success = false,
                    message = result.Message
                });
            }

            return Ok(new
            {
                success = true,
                message = result.Message,
                userId = result.UserId
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(
            [FromBody] LoginDto dto)
        {
            var result = await _userService.LoginAsync(dto);

            if (!result.Success)
            {
                return BadRequest(new
                {
                    success = false,
                    message = result.Message
                });
            }

            return Ok(new
            {
                success = true,
                message = result.Message
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetByIdAsync(id);

            if (user == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "User not found"
                });
            }

            return Ok(user);
        }  

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UserDto dto)
        {
            var (Success, Message) = await _userService.UpdateUserAsync(id, dto);

            if (!Success)
            {
                return BadRequest(new
                {
                    success = false,
                    message = Message
                });
            }

            return Ok(new
            {
                success = true,
                message = Message
            });
        }
    }
}