using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebSchedule.Controllers.Responses;

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
    }

}