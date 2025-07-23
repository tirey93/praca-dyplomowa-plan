using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebSchedule.Controllers.Message.Commands;
using WebSchedule.Controllers.Message.Queries;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain;
using WebSchedule.Hubs.Dtos;
using WebSchedule.Utils;

namespace WebSchedule.Controllers.Message
{
    [ApiController]
    [Route("[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly IMediator _mediator;

        public MessageController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("ByLoggedIn")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult> SendByLoggedIn([FromBody] SendCommand command)
        {
            try
            {
                var userId = JwtHelper.GetUserIdFromToken(Request.Headers.Authorization)
                    ?? throw new UserNotFoundException();

                command.SenderId = userId;
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

        [HttpGet("Group/{groupId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetByGroup(int groupId)
        {
            try
            {
                return Ok(await _mediator.Send(new GetByGroupQuery
                {
                    GroupId = groupId
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