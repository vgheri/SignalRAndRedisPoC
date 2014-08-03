using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebRole1.Models;

namespace WebRole1.Controllers
{
    public class HomeController : Controller
    {
        private static int auctionNr = 1;
        public ActionResult Index()
        {
            string userId = string.Empty;
            var cookie = HttpContext.Request.Cookies["auth"];
            if (cookie == null)
            {
                userId = Guid.NewGuid().ToString();
                HttpContext.Response.Cookies.Add(new HttpCookie("auth", userId));
            }
            else
            {
                userId = cookie.Value; 
            }
            return View(userId);
        }

        [HttpPost]
        public ActionResult Index(Bid bid)
        {
            // Get the AuctionStatus from Redis
            // Check if the bid amount > AuctionStatus.Price
            // If yes, update and add this bid to the AuctionStatus.BidHistory
            // Store the AuctionStatus in Redis
            // Then invoke AuctionHub.NotifyBidPlaced()
            throw new NotImplementedException();
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