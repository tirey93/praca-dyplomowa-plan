using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebSchedule.Controllers.Building.Commands;
using WebSchedule.Controllers.Building.Queries;
using WebSchedule.Controllers.Responses;
using WebSchedule.Domain;
using WebSchedule.Responses;

namespace WebSchedule.Controllers.Building
{
    [ApiController]
    [Route("[controller]")]
    public class BuildingController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BuildingController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<IEnumerable<BuildingResponse>>> Get()
        {
            try
            {
                return Ok(await _mediator.Send(new GetAllQuery()));
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
        [AllowAnonymous]
        public async Task<ActionResult<StudyCourseResponse>> Create([FromBody] CreateBuildingCommand command)
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