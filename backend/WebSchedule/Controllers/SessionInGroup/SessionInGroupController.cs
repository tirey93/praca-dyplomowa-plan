using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.SessionInGroup.Commands;
using WebSchedule.Controllers.SessionInGroup.Queries;
using WebSchedule.Domain;

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
        public async Task<ActionResult<IEnumerable<SessionInGroupResponse>>> GetDefaults()
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

        [HttpGet("Group/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<IEnumerable<SessionInGroupResponse>>> GetByGroup(int id)
        {
            try
            {
                return Ok(await _mediator.Send(new GetByGroupQuery
                {
                    GroupId = id
                }));
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

        [HttpPut("Session")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult> UpdateSessions([FromBody] UpdateSessionsInGroupCommand command)
        {
            try
            {
                await _mediator.Send(command);
                return NoContent();
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