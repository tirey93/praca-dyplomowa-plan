using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Controllers.User.Queries;
using WebSchedule.Controllers.UserInGroup.Requests;
using WebSchedule.Domain.Exceptions;
using WebSchedule.Properties;
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
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
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
            catch (UserNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (GroupNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (CandidateAlreadyInAGroupException ex)
            {
                return Conflict(new ErrorMessage(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ErrorMessage(ex.Message));
            }
        }

        [HttpPut("Disenroll")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
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
            catch (UserNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (GroupNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (NoSuchMemberInGroupException ex)
            {
                return Conflict(new ErrorMessage(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ErrorMessage(ex.Message));
            }
        }

    }

}