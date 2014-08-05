using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.SignalR;
using WebRole1.Hubs;
using WebRole1.Models;

namespace WebRole1.Controllers
{
    public class HomeController : Controller
    {
        private const int AUCTION_NR = 1;
        private readonly string AUCTION_STATUS_CACHE_KEY;

        public HomeController()
        {
            AUCTION_STATUS_CACHE_KEY = "articleStatus_" + AUCTION_NR;
        }

        public ActionResult Index()
        {
            var cookie = HttpContext.Request.Cookies["auth"];
            if (cookie == null)
            {
                var userId = Guid.NewGuid().ToString();
                HttpContext.Response.Cookies.Add(new HttpCookie("auth", userId));
            }
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> Index(Bid bid)
        {
            // Get the ArticleStatus from Redis
            var auctionStatus = await CacheManager.Get<ArticleStatus>(AUCTION_STATUS_CACHE_KEY);
            // If there
            if (auctionStatus != null)
            {
                // Check if the bid amount is valid, that is the user increased the article price
                if (bid.Amount > auctionStatus.Price)
                {
                    // If yes, update and add this bid to the AuctionStatus.BidHistory
                    auctionStatus.Price = bid.Amount;
                    auctionStatus.BidHistory.Add(bid);
                }
                else
                {
                    ModelState.AddModelError("Amount", "The bid must be greater of the current price of the article.");
                    return View();
                }
            }
            // If not, create it
            else
            {
                auctionStatus = new ArticleStatus
                    {
                        Price = bid.Amount,
                        BidHistory = new List<Bid>() {bid}
                    };
            }
            // Store the AuctionStatus in Redis
            var saved = await CacheManager.Set(AUCTION_STATUS_CACHE_KEY, auctionStatus);
            // Then inform clients that a new bid has been placed
            var signalRContext = GlobalHost.ConnectionManager.GetHubContext<AuctionHub>();
            signalRContext.Clients.All.notifyBidPlaced(bid.Amount);
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}