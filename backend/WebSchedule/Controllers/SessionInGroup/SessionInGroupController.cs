using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.SessionInGroup.Queries;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Controllers.UserInGroup.Queries;
using WebSchedule.Controllers.UserInGroup.Requests;
using WebSchedule.Domain;
using WebSchedule.Utils;

namespace WebSchedule.Controllers.SessionInGroup
{
    [ApiController]
    [Route("[controller]")]
    public class SessionInGroupController : ControllerBase
    {
        private readonly IMediator _mediator;

        public SessionInGroupController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("Default")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<IEnumerable<UserGroupResponse>>> GetLoggedIn()
        {
            try
            {
                return Ok(await _mediator.Send(new GetDefaultQuery()));
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ex.FromApplicationException());
            }
            catch (DomainException ex)
            {
                return BadRequest(ex.FromDomainException());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { ex.Message });
            }
        }

    }

}