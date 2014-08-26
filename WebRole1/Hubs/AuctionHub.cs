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
        private static string auctionTitle = "TOP Terrarium mit 2 Leopardengeckos";

        public void FollowAuction()
        {
            var groupName = "AuctionGroup_" + auctionNr.ToString();
            IDictionary<string, List<string>> auctionFollowersDictionary;
            // Try get the dictionary associated with this auction
            auctionFollowersDictionary = CacheManager.Get<IDictionary<string, List<string>>>(groupName);
           
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
                    }
                    else
                    {
                        var signalRContext = GlobalHost.ConnectionManager.GetHubContext<AuctionHub>();
                        signalRContext.Clients.Client(Context.ConnectionId).followedAuction(WARNING, "You already follow this auction");
                        return;
                    }
                }
            }
            else // No ==> Create the list and add the connection id to the list
            {
                auctionFollowersDictionary = new Dictionary<string, List<string>>();
                auctionFollowersDictionary.Add(auctionNr.ToString(), new List<string> { Context.ConnectionId });
            }
            //Add this customer in the group of Follower. Then he will be able to get notification
            Groups.Add(Context.ConnectionId, groupName);
            string name = GetUser();
            AddGroupToUser(name, groupName);
            // Save the dictionary
            CacheManager.Set(groupName, auctionFollowersDictionary);

            Clients.Caller.followedAuction(SUCCESS, "You are now following this auction");
            NotifyGroup(groupName, new string[] { Context.ConnectionId },
                "A new customer follows auction <a href='http://localhost:4884/'>" + auctionTitle + "</a>");
        }

        private void NotifyGroup(string groupName, string[] exclusionList, string message)
        {
            var signalRContext = GlobalHost.ConnectionManager.GetHubContext<AuctionHub>();            
            signalRContext.Clients.Group(auctionNr.ToString(), exclusionList).followedAuction(INFO, message);
        }
        
        public void BidAuction(double amount)
        {
            var messageToOther = "A new bid of " + amount + " has been placed on the auction: <a href='http://localhost:4884/'>" + auctionTitle + "</a>  " + auctionNr;
            var message = "You successfully placed a bid of " + amount;

            // Then inform clients that a this article is followed
            var groupName = "AuctionGroup_" + auctionNr.ToString();
            var signalRContext = GlobalHost.ConnectionManager.GetHubContext<AuctionHub>();
            signalRContext.Clients.Group(groupName, Context.ConnectionId).notifyBidPlaced(INFO, messageToOther);
            //NotifyGroup(groupName, new string[] { Context.ConnectionId }, messageToOther);
            Clients.Caller.notifyBidPlaced(SUCCESS, message);

        }

        public override Task OnConnected()
        {
            string name = GetUser();

            /*
             * On connect, the system needs to check if in Redis this user was previously assigned to some groups.
             * If yes, the system retrieves the list of groups and adds A's connectionID to them.
             */
            var groups = GetGroupsForUser(name);
            if (groups != null && groups.Count > 0)
            {
                foreach (var group in groups)
                {
                    Groups.Add(Context.ConnectionId, group);
                }
            }
            return base.OnConnected();
        }

        #region Utilities

        private void AddGroupToUser(string name, string groupName)
        {
            var groups = GetGroupsForUser(name);
            if (groups != null && groups.Count > 0)
            {
                groups.Add(groupName);
            }
            else
            {
                groups = new List<string> { groupName };
            }
            CacheManager.Set(name + "_groups", groups);
        }

        private List<string> GetGroupsForUser(string name)
        {
            var key = name + "_groups";
            return CacheManager.Get<List<string>>(key);
        }

        private string GetUser()
        {
            string name = Context.User.Identity.Name;
            if (string.IsNullOrEmpty(name))
            {
                var cookie = Context.RequestCookies.Where(c => c.Key.Equals("auth")).FirstOrDefault();
                if (cookie.Value != null && !string.IsNullOrEmpty(cookie.Value.Value))
                {
                    name = cookie.Value.Value;
                }
                else
                {
                    throw new Exception("Unknown user");
                }
            }
            return name;
        }

        #endregion
    }
}