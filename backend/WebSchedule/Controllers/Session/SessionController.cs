using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.Session.Commands;
using WebSchedule.Controllers.Session.Queries;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain;
using WebSchedule.Utils;

namespace WebSchedule.Controllers.Session
{
    [ApiController]
    [Route("[controller]")]
    public class SessionController : ControllerBase
    {
        private readonly IMediator _mediator;

        public SessionController(IMediator mediator)
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
        public async Task<ActionResult<IEnumerable<SessionResponse>>> GetDefaults()
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

        [HttpGet("Group/{id}/Current")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<SessionResponse>> GetCurrent(int id)
        {
            try
            {
                return Ok(await _mediator.Send(new GetCurrentQuery
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

        [HttpGet("CurrentForLogged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<SessionResponse>> GetCurrentForLogged()
        {
            try
            {
                var userId = JwtHelper.GetUserIdFromToken(Request.Headers.Authorization)
                    ?? throw new UserNotFoundException();

                return Ok(await _mediator.Send(new GetCurrentForLoggedQuery
                {
                    UserId = userId
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

        [HttpGet("Next")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<SessionResponse>> GetNext(
            [FromQuery] int sessionNumber,
            [FromQuery] int weekNumber,
            [FromQuery] bool springSemester,
            [FromQuery] string groupIds)
        {
            try
            {
                groupIds ??= string.Empty;

                return Ok(await _mediator.Send(new GetNextQuery
                {
                    SessionNumber = sessionNumber,
                    WeekNumber = weekNumber,
                    SpringSemester = springSemester,
                    GroupIds = [.. groupIds.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(int.Parse)],
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

        [HttpGet("Previous")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<SessionResponse>> GetPrevious(
            [FromQuery] int sessionNumber,
            [FromQuery] int weekNumber,
            [FromQuery] bool springSemester,
            [FromQuery] string groupIds)
        {
            try
            {
                return Ok(await _mediator.Send(new GetPreviousQuery
                {
                    SessionNumber = sessionNumber,
                    WeekNumber = weekNumber,
                    SpringSemester = springSemester,
                    GroupIds = [.. groupIds.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(int.Parse)],
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

        [HttpGet("Group/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<IEnumerable<SessionResponse>>> GetByGroup(int id)
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