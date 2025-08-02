using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebSchedule.Controllers.Activity.Queries;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.Session.Queries;
using WebSchedule.Domain;

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
            [FromQuery] int sessionNumber,
            [FromQuery] int startingHour,
            [FromQuery] int duration)
        {
            try
            {
                return Ok(await _mediator.Send(new GetConflictsQuery
                {
                    GroupId = groupId,
                    SessionNumber = sessionNumber,
                    StartingHour = startingHour,
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
    }

}