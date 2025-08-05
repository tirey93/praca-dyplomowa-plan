using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebSchedule.Controllers.Group.Commands;
using WebSchedule.Controllers.Group.Queries;
using WebSchedule.Controllers.Responses;
using WebSchedule.Controllers.User.Exceptions;
using WebSchedule.Domain;
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

        [HttpGet("{groupId}/LoggedUserCanLeave")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<bool>> CanLeaveGroup(int groupId)
        {
            try
            {
                var userId = JwtHelper.GetUserIdFromToken(Request.Headers.Authorization)
                    ?? throw new UserNotFoundException();

                return Ok(await _mediator.Send(new CanLeaveGroupQuery
                {
                    UserId = userId,
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

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<IEnumerable<GroupInfoResponse>>> GetGroups([FromQuery] bool exceptLoggedIn)
        {
            try
            {

                int? userId = null;
                if (exceptLoggedIn)
                {
                    userId = JwtHelper.GetUserIdFromToken(Request.Headers.Authorization)
                        ?? throw new UserNotFoundException();
                }

                return Ok(await _mediator.Send(new GetGroupsQuery
                {
                    ExceptUserId = userId,
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

        [HttpGet("ByIds")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<IEnumerable<GroupInfoResponse>>> GetGroupsById(
            [FromQuery] string ids)
        {
            try
            {
                ids ??= string.Empty;
                return Ok(await _mediator.Send(new GetGroupsByIdQuery
                {
                    GroupIds = [.. ids.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(int.Parse)]
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

        [HttpGet("{id}/Exists")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<bool>> IsGroupExists(int id)
        {
            try
            {
                return Ok(await _mediator.Send(new GetGroupByIdExistsQuery
                {
                    GroupId = id,
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

        [HttpGet("subgroup/next")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult<UserGroupResponse>> GetNextSubgroup(
            [FromQuery] int year,
            [FromQuery] string studyLevel,
            [FromQuery] int courseId)
        {
            try
            {
                return Ok(await _mediator.Send(new GetNextSubGroupQuery
                {
                    Year = year,
                    StudyLevel = studyLevel,
                    CourseId = courseId
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
        public async Task<ActionResult<GroupResponse>> Create([FromBody] CreateGroupCommand command)
        {
            try
            {
                var userId = JwtHelper.GetUserIdFromToken(Request.Headers.Authorization)
                    ?? throw new UserNotFoundException();

                command.UserId = userId;
                var course = await _mediator.Send(command);
                return Ok(course);
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
        public async Task<ActionResult<GroupResponse>> Delete(int id)
        {
            try
            {
                
                await _mediator.Send(new DeleteGroupCommand
                {
                    GroupId = id
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

        [HttpPut("Semester")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
#if !DEBUG
        [Authorize]
#endif
        public async Task<ActionResult> UpdateSemester([FromBody] UpdateSemesterCommand command)
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