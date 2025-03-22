using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebSchedule.Constants;

namespace WebSchedule.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddJWTAuthentication(this IServiceCollection services, string issuer, string audience, string envVariable)
        {
            var signingKey = Environment.GetEnvironmentVariable(envVariable);

            services.AddAuthentication(auth =>
            {
                auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                auth.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    ValidateAudience = true,
                    ValidAudience = audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey))
                };
                options.Events = new JwtBearerEvents()
                {
                    OnMessageReceived = context =>
                    {
                        if (context.Request.Headers.ContainsKey(Constants.Constants.Authorization))
                        {
                            context.Token = context.Request.Headers.Authorization.GetToken();
                        }
                        return Task.CompletedTask;
                    }
                };
            });
        }
    }
}
