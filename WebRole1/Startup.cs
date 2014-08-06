using Microsoft.Owin;
using Owin;
using Microsoft.AspNet.SignalR;
[assembly: OwinStartupAttribute(typeof(WebRole1.Startup))]
namespace WebRole1
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var hubConfiguration = new HubConfiguration();
            hubConfiguration.EnableDetailedErrors = true;
            GlobalHost.DependencyResolver.UseRedis("signalrandredispoc.redis.cache.windows.net", 6379,
                "ourpassword", "signalrandredispoc");
            app.MapSignalR(hubConfiguration);
        }
    }
}
