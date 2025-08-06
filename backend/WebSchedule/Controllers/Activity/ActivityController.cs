using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebSchedule.Controllers.Activity.Commands;
using WebSchedule.Controllers.Activity.Queries;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain;
using WebSchedule.Utils;

namespace WebSchedule.Controllers.Activity
{
    [ApiController]
    [Route("[controller]")]
    public class ActivityController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ActivityController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("Conflicts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<IEnumerable<ActivityResponse>>> GetConflicts(
            [FromQuery] int groupId,
            [FromQuery] string sessionNumbers,
            [FromQuery] bool springSemester,
            [FromQuery] int startingHour,
            [FromQuery] string weekDay,
            [FromQuery] int duration)
        {
            try
            {
                sessionNumbers ??= string.Empty;
                return Ok(await _mediator.Send(new GetConflictsQuery
                {
                    GroupId = groupId,
                    SessionNumbers = [.. sessionNumbers.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(int.Parse)],
                    SpringSemester = springSemester,
                    StartingHour = startingHour,
                    WeekDay = weekDay,
                    Duration = duration
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

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<ActivityResponse>> GetById(int id)
        {
            try
            {
                return Ok(await _mediator.Send(new GetByIdQuery
                {
                    ActivityId = id
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

        [HttpGet("Group/{id}/ByCurrentDate")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<IOrderedEnumerable<ActivityInSessionResponse>>> GetByCurrentDate(int id,
            [FromQuery] bool springSemester,
            [FromQuery] int sessionCount)
        {
            try
            {
                return Ok(await _mediator.Send(new GetByCurrentDateQuery
                {
                    GroupId = id,
                    SessionCount = sessionCount,
                    SpringSemester = springSemester
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

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult> Create([FromBody] CreateActivityCommand command)
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

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult> Update(int id, [FromBody] UpdateActivityCommand command)
        {
            try
            {
                command.ActivityId = id;
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

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _mediator.Send(new DeleteActivityCommand
                {
                    ActivityId = id
                });
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