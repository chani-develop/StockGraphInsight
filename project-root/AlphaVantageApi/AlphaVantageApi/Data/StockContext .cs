
using AlphaVantageApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AlphaVantageApi.Data
{
    public class StockContext : DbContext
    {
        public StockContext(DbContextOptions<StockContext> options) : base(options) { }

        public DbSet<StockPrice> StockPrices { get; set; }


    }
}
