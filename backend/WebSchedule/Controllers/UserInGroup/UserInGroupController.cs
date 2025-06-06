using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Controllers.UserInGroup.Requests;
using WebSchedule.Domain;
using WebSchedule.Utils;

namespace WebSchedule.Controllers.User
{
    [ApiController]
    [Route("[controller]")]
    public class UserInGroupController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UserInGroupController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult> AddCandidate([FromBody] AddCandidateRequest addCandidateRequest)
        {
            try
            {
                var userId = JwtHelper.GetUserIdFromToken(Request.Headers.Authorization)
                    ?? throw new UserNotFoundException();

                await _mediator.Send(new AddCandidateCommand
                {
                    UserId = userId,
                    GroupId = addCandidateRequest.GroupId
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

        [HttpPut("Disenroll")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult> DisenrollFromGroup([FromBody] DisenrollFromGroupRequest deleteFromGroupRequest)
        {
            try
            {
                var userId = JwtHelper.GetUserIdFromToken(Request.Headers.Authorization)
                    ?? throw new UserNotFoundException();
                await _mediator.Send(new DisenrollFromGroupCommand
                {
                    UserId = userId,
                    GroupId = deleteFromGroupRequest.GroupId
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