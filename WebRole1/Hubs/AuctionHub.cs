using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using WebRole1.Models;
using System.Threading.Tasks;

namespace WebRole1.Hubs
{
    public class AuctionHub : Hub
    {
        private const string INFO = "info";
        private const string SUCCESS= "success";
        private const string WARNING= "warning";

        private static int auctionNr = 1;
        public void FollowAuction()
        {
            IDictionary<string, List<string>> auctionFollowersDictionary;
            // Try get the dictionary associated with this auction            
            auctionFollowersDictionary = CacheManager.Get<IDictionary<string, List<string>>>(auctionNr.ToString());
           
            // Exists?
            if (auctionFollowersDictionary != null)
            {
                // Yes ==> Add connection id to the list
                List<string> followers = null;
                var found = auctionFollowersDictionary.TryGetValue(auctionNr.ToString(), out followers);
                if (found)
                {
                    if (!followers.Contains(Context.ConnectionId))
                    {
                        followers.Add(Context.ConnectionId);

                        //Notify Followers of a new comer
                        NotifyFollowers();
                    }
                    else
                    {
                        var signalRContext = GlobalHost.ConnectionManager.GetHubContext<AuctionHub>();
                        signalRContext.Clients.Client(Context.ConnectionId).followedAuction(WARNING, "You already follow this auction");
                    }
                }
            }
            else // No ==> Create the list and add the connection id to the list
            {
                auctionFollowersDictionary = new Dictionary<string, List<string>>();
                auctionFollowersDictionary.Add(auctionNr.ToString(), new List<string> { Context.ConnectionId });

                //Notify Followers of a new comer
                NotifyFollowers();
            }

            // Save the dictionary
            CacheManager.Set(auctionNr.ToString(), auctionFollowersDictionary);
        }

        private void NotifyFollowers()
        {
            //Add this customer in the group of Follower. Then he will be able to get notification
            Groups.Add(Context.ConnectionId, auctionNr.ToString());

            // Then inform clients that a this article is followed
            var signalRContext = GlobalHost.ConnectionManager.GetHubContext<AuctionHub>();
            var messageToOther = "A new customer " + Context.ConnectionId + " follow the auction " + auctionNr;
            var message = "You are now following the auction " + auctionNr;

            signalRContext.Clients.Group(auctionNr.ToString(), Context.ConnectionId).followedAuction(INFO, messageToOther);
            signalRContext.Clients.Client(Context.ConnectionId).followedAuction(SUCCESS, message);
        }


        public void BidAuction(double amount)
        {
            var messageToOther = "A new bid of " + amount + " has been placed on the auction: " + auctionNr;
            var message = "You successfully placed a bid of " + amount;

            // Then inform clients that a this article is followed
            var signalRContext = GlobalHost.ConnectionManager.GetHubContext<AuctionHub>();
            signalRContext.Clients.Group(auctionNr.ToString(), Context.ConnectionId).notifyBidPlaced(INFO, messageToOther);
            signalRContext.Clients.Client(Context.ConnectionId).notifyBidPlaced(SUCCESS, message);

        }
    }
}