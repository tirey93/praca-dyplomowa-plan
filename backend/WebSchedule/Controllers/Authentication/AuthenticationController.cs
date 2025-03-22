using WebSchedule.Constants;
using WebSchedule.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using MediatR;
using WebSchedule.Controllers.Authentication.Commands;
using WebSchedule.Controllers.Authentication.Exceptions;
using WebSchedule.Properties;
using WebSchedule.Controllers.Authentication.Queries;
using WebSchedule.Controllers.Responses;
using WebSchedule.Extensions;

namespace WebSchedule.Controllers.Authentication
{
    [Route("[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IMediator _mediator;

        public AuthenticationController(IConfiguration configuration, IMediator mediator)
        {
            _configuration = configuration;
            _mediator = mediator;
        }

        //[HttpGet("google")]
        //[AllowAnonymous]
        //public IActionResult GetGoogleLoginLink()
        //{
        //    var loginLink = _configuration.GetGoogleLoginLink();
        //    return Ok(new { link = loginLink });
        //}

        //[HttpGet("google/callback")]
        //[ProducesResponseType(StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status400BadRequest)]
        //[ProducesResponseType(StatusCodes.Status403Forbidden)]
        //[ProducesResponseType(StatusCodes.Status500InternalServerError)]
        //[AllowAnonymous]
        //public async Task<IActionResult> GoogleCallback([FromQuery] string code)
        //{
        //    if (string.IsNullOrEmpty(code))
        //        return StatusCode((int)HttpStatusCode.InternalServerError,
        //            Resource.ValidatorAuthorizationCodeNotProvided);

        //    GoogleUserResponse userInfo = null;
        //    try
        //    {
        //        var accessToken = await _googleClient.GetAccessTokenAsync(code);
        //        userInfo = await _googleClient.GetUserInfoAsync(accessToken);

        //        var user = await _mediator.Send(new GetUserByNameQuery
        //        {
        //            Username = userInfo.Email
        //        });

        //        await Login(new LoginRequest
        //        {
        //            Username = user.Name,
        //            Password = null
        //        });

        //    }
        //    catch (UserNotFoundException ex)
        //    {
        //        if (userInfo != null)
        //        {
        //            await Register(new RegisterRequest
        //            {
        //                DisplayName = userInfo.Name,
        //                Username = userInfo.Email,
        //                Password = null
        //            });
        //        }
        //        else
        //        {
        //            return StatusCode((int)HttpStatusCode.BadRequest,
        //                Resource.ExceptionFailedToFetchUserInfo);
        //        }
        //    }
        //    catch (AuthenticationFailureException ex)
        //    {
        //        return StatusCode((int)HttpStatusCode.Forbidden,
        //            string.Format(Resource.ControllerForbidden, ex.Message));
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode((int)HttpStatusCode.InternalServerError,
        //            string.Format(Resource.ControllerInternalError, ex.Message));
        //    }
        //    var redirectUrl = Uri.UnescapeDataString(_configuration["GoogleOAuth:ReturnUrl"]);
        //    return Redirect(redirectUrl);
        //}


        UserResponse user = new UserResponse
        {
            Id = 1,
            DisplayName = "Test",
            Name = "Test",
            ReservationDisabled = false,
            Role = "Admin",
        };

        [HttpPost("Register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [AllowAnonymous]
        public async Task<ActionResult<UserResponse>> Register([FromBody] RegisterCommand command)
        {
            try
            {
                var response = await _mediator.Send(command);
                AppendToCookie(response);
                return Ok(response);
            }
            catch (UserAlreadyExistsException ex)
            {
                return StatusCode((int)HttpStatusCode.BadRequest,
                    string.Format(Resource.ControllerBadRequest, ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError,
                    string.Format(Resource.ControllerInternalError, ex.Message));
            }
        }

        [HttpPost("Login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [AllowAnonymous]
        public async Task<ActionResult<UserResponse>> Login([FromBody] LoginQuery query)
        {
            try
            {
                //var response = await _mediator.Send(query);
                AppendToCookie(user);

                return Ok(user);
            }
            catch (UserNotFoundException ex)
            {
                return StatusCode((int)HttpStatusCode.NotFound,
                    string.Format(Resource.ControllerNotFound, ex.Message));
            }
            catch (PasswordNotMatchException ex)
            {
                return StatusCode((int)HttpStatusCode.BadRequest,
                    string.Format(Resource.ControllerBadRequest, ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError,
                    string.Format(Resource.ControllerInternalError, ex.Message));
            }
        }

        [HttpPost("Logout")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize(Roles = Roles.User)]
#endif
        public IActionResult Logout()
        {
            try
            {
                Response.Cookies.Delete(Cookies.UserId, new CookieOptions()
                {
                    SameSite = SameSiteMode.None,
                    Secure = true,
                    HttpOnly = true,
                    MaxAge = new TimeSpan(12, 0, 0),
                    Domain = "localhost"
                });
                Response.Cookies.Delete(Cookies.AccessToken, new CookieOptions()
                {
                    SameSite = SameSiteMode.None,
                    Secure = true,
                    HttpOnly = true,
                    MaxAge = new TimeSpan(12, 0, 0),
                    Domain = "localhost"
                });

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError,
                    string.Format(Resource.ControllerInternalError, ex.Message));
            }
        }

        private void AppendToCookie(UserResponse response)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Role, response.Role)
            };

            var signingKey = Environment.GetEnvironmentVariable(_configuration["JWT:EnvironmentSecretVariableName"]);
            if (string.IsNullOrEmpty(signingKey))
                throw new MissingSigningKeyException();

            var token = JwtHelper.GetJwtToken(
                response.Name,
                signingKey,
                _configuration["JWT:Issuer"],
                _configuration["JWT:Audience"],
                TimeSpan.FromMinutes(24 * 60),
                claims.ToArray());

            Response.Cookies
                .AppendToCookie(Cookies.AccessToken, new JwtSecurityTokenHandler().WriteToken(token))
                .AppendToCookie(Cookies.UserId, response.Id.ToString());
        }
    }
}