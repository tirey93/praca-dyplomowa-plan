using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using WebSchedule.Constants;
using WebSchedule.Controllers.Authentication.Exceptions;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Controllers.User.Queries;
using WebSchedule.Properties;
using WebSchedule.Utils;

namespace WebSchedule.Controllers.User
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UserController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("LoggedIn")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
//#if !DEBUG
        [Authorize(Roles = Roles.User)]
//#endif
        public async Task<ActionResult<UserResponse>> GetLoggedIn()
        {
            try
            {
                var userId = JwtHelper.GetUserIdFromToken(Request.Headers.Authorization)
                    ?? throw new UserNotFoundException();

                return Ok(await _mediator.Send(new GetUserQuery
                {
                    UserId = userId,
                }));
            }
            catch (UserNotFoundException ex)
            {
                return StatusCode((int)HttpStatusCode.NotFound,
                    string.Format(Resource.ControllerNotFound, ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError,
                    string.Format(Resource.ControllerInternalError, ex.Message));
            }
        }

    }

}