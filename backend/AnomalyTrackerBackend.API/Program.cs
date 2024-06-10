using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using AnomalyTrackerBackend.DAL;
using AnomalyTrackerBackend.DAL.Initializer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder
                    .UseUrls("https://0.0.0.0:6587")
                    .UseStartup<Startup>();
            })
            .ConfigureAppConfiguration((hostingContext, config) =>
            {
                config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
                config.AddEnvironmentVariables();
            });
}

public class Startup
{
    public IConfiguration Configuration { get; }

    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddAutoMapper(typeof(Startup));

        // Check if environment variables are set
        var server = "db.test";
        var database = "postgres";
        var username = Environment.GetEnvironmentVariable("AWS_DB_USERNAME");
        var password = Environment.GetEnvironmentVariable("AWS_DB_PASSWORD");

        // Use environment variables if set, otherwise use default configuration
        var connectionString = !string.IsNullOrEmpty(server) &&
                               !string.IsNullOrEmpty(database) && !string.IsNullOrEmpty(username) &&
                               !string.IsNullOrEmpty(password)
            ? $"Server={server};Port=5432;Database={database};Username={username};Password={password};Timeout=60;"
            : Configuration.GetConnectionString("DefaultConnection")
              ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        services.AddDbContext<AnomalyTrackerDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddControllers();
        services.AddSwaggerService();

        services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

        // Add CORS configuration
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyHeader()
                       .AllowAnyMethod();
            });
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IConfiguration configuration)
    {
        if (env.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        app.UseCors(); // Enable CORS

        app.UseMiddleware<ApiKeyMiddleware>(configuration);

        // app.UseHsts();
        // app.UseHttpsRedirection();

        app.UseRouting();

        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });

        using (var scope = app.ApplicationServices.CreateScope())
        {
            var anomalyContext = scope.ServiceProvider.GetRequiredService<AnomalyTrackerDbContext>();
            DBInitializer.Initialize(anomalyContext);
        }
    }
    internal class ApiKeyMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _apiKeyHeader;
        private readonly string _apiKeyValue;

        public ApiKeyMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _apiKeyHeader = "X-API-Key";
            _apiKeyValue = "tracktech-key";
            //_apiKeyHeader = Environment.GetEnvironmentVariable("API_KEY_HEADER");
            //_apiKeyValue = Environment.GetEnvironmentVariable("ApiKeyValue");
        }

        public async Task Invoke(HttpContext context)
        {
            var apiKeyHeader = context.Request.Headers[_apiKeyHeader];

            if (apiKeyHeader != _apiKeyValue)
            {
                context.Response.StatusCode = 401; // Unauthorized
                await context.Response.WriteAsync("Invalid or missing API key");
                return;
            }

            await _next(context);
        }
    }

}
