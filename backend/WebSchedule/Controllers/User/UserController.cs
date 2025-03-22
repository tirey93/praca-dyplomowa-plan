using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WebSchedule.Constants;
using WebSchedule.Controllers.Authentication.Exceptions;
using WebSchedule.Controllers.Responses;
using WebSchedule.Properties;

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
#if !DEBUG
        [Authorize(Roles = Roles.Admin)]
#endif
        public async Task<ActionResult<IEnumerable<UserResponse>>> Get()
        {
            try
            {
                //var query = new GetAllUsersQuery();
                //var result = await _mediator.Send(query);
                return Ok("In Get");
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