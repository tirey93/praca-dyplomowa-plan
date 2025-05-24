using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WebSchedule.Controllers.Group.Exceptions;
using WebSchedule.Controllers.Group.Queries;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Properties;
using WebSchedule.Utils;

namespace WebSchedule.Controllers.Group
{
    [ApiController]
    [Route("[controller]")]
    public class GroupController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GroupController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("ByLoggedIn")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<IEnumerable<UserGroupResponse>>> GetLoggedIn()
        {
            try
            {
                var userId = JwtHelper.GetUserIdFromToken(Request.Headers.Authorization)
                    ?? throw new UserNotFoundException();

                return Ok(await _mediator.Send(new GetGroupsByLoggedInQuery
                {
                    UserId = userId,
                }));
            }
            catch (UserNotFoundException ex)
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

        [HttpGet()]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<IOrderedEnumerable<GroupInfoResponse>>> Get()
        {
            try
            {
                var userId = JwtHelper.GetUserIdFromToken(Request.Headers.Authorization)
                    ?? throw new UserNotFoundException();

                return Ok(await _mediator.Send(new GetGroupsInQuery
                {
                    UserId = userId,
                }));
            }
            catch (UserNotFoundException ex)
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

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<UserGroupResponse>> GetById(int id)
        {
            try
            {
                return Ok(await _mediator.Send(new GetGroupByIdQuery
                {
                    GroupId = id,
                }));
            }
            catch (GroupNotFoundException ex)
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