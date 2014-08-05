using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebRole1.Models
{
    [Serializable]
    public class ArticleStatus
    {
        public decimal Price { get; set; }
        public List<Bid> BidHistory { get; set; }
    }
}