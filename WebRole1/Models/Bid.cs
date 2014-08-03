using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebRole1.Models
{
    public class Bid
    {
        public decimal Amount { get; set; }
        public Guid UserId { get; set; }
    }
}