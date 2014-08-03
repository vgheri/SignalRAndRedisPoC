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
        private static int auctionNr = 1;
        public async Task<bool> FollowAuction()
        {
            IDictionary<string, List<string>> auctionFollowersDictionary;
            // Try get the dictionary associated with this auction
            auctionFollowersDictionary = await CacheManager.Get<IDictionary<string, List<string>>>(auctionNr.ToString());
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
                }
            }
            else // No ==> Create the list and add the connection id to the list
            {
                auctionFollowersDictionary = new Dictionary<string, List<string>>();
                auctionFollowersDictionary.Add(auctionNr.ToString(), new List<string> { Context.ConnectionId });    
            }            
            // Save the dictionary
            return await CacheManager.Set(auctionNr.ToString(), auctionFollowersDictionary);
        }

        public string NotifyBidPlaced()
        {
            throw new NotImplementedException();
        }
    }
}