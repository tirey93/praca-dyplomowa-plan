using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using WebSchedule.Constants;
using WebSchedule.Controllers.Authentication.Exceptions;
using WebSchedule.Controllers.Responses;
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

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
//#if !DEBUG
        [Authorize(Roles = Roles.User)]
//#endif
        public async Task<ActionResult<IEnumerable<UserResponse>>> Get()
        {
            try
            {
                var userId = JwtHelper.GetUserIdFromToken(Request.Headers.Authorization);
                var role = JwtHelper.GetRoleClaimFromToken(Request.Headers.Authorization);


                //var query = new GetAllUsersQuery();
                //var result = await _mediator.Send(query);
                return Ok(new
                {
                    UserId = userId,
                    Role = role
                });
            }
            catch (LoginFailedException ex)
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