using Microsoft.Owin;
using Owin;
using WebRole1;

namespace WebRole1.App_Start
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
} 
