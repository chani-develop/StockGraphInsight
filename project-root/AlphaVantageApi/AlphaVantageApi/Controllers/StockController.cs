




using AlphaVantageApi.Data;
using AlphaVantageApi.Models;
using AlphaVantageApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AlphaVantageApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly StockContext _context;
        private readonly AlphaVantageService _alphaService;

        public StockController(StockContext context, AlphaVantageService alphaService)
        {
            _context = context;
            _alphaService = alphaService;
        }

        // GET: api/<StockController>
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<StockPrice>>> GetAll()
        {
            return await _context.StockPrices.OrderByDescending(s => s.Date).ToListAsync();
        }

        // תאריך מסוים
        // yy-mm-dd כך לשלוח לו!!!
        [HttpGet("date/{date}/{symbol}")]
        public async Task<ActionResult<IEnumerable<StockPrice>>> GetByDate(DateTime date , string symbol)
        {
            var data = await _context.StockPrices
                .Where(s => s.Date.Date == date.Date && s.Symbol == symbol).ToListAsync();
            return Ok(data);
        }


        //current day
        [HttpGet("today/{symbol}")]
        public async Task<ActionResult<IEnumerable<StockPrice>>> GetToday(string symbol)
        {
            var today = DateTime.Today;
            return await GetByDate(today ,symbol);
        }



        // 30 יום אחרונים
        [HttpGet("last30days/{symbol}")]
        public async Task<ActionResult<IEnumerable<StockPrice>>> GetLast30Days(string symbol)
        {
            try
            {
                var fromDate = DateTime.Today.AddDays(-30);
                var data = await _context.StockPrices
                    .Where(s => s.Date >= fromDate && (string.IsNullOrEmpty(symbol) || s.Symbol == symbol))
                    .OrderByDescending(s => s.Date)
                    .ToListAsync();

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // שבוע קודם (7 ימים אחורה לא כולל היום)
        [HttpGet("lastweek/{symbol}")]
        public async Task<ActionResult<IEnumerable<StockPrice>>> GetLastWeek(string symbol)
        {

            var from = DateTime.Today.AddDays(-7);
            var to = DateTime.Today.AddDays(-1);

            return await _context.StockPrices
                .Where(s => s.Date >= from && s.Date <= to &&  s.Symbol == symbol)
                .OrderByDescending(s => s.Date)
                .ToListAsync();
        }

        // חצי שנה אחרונה
        [HttpGet("last6months/{symbol}")]
        public async Task<ActionResult<IEnumerable<StockPrice>>> GetLast6Months(string symbol)
        {
            var from = DateTime.Today.AddMonths(-6);

            return await _context.StockPrices
                .Where(s => s.Date >= from && s.Symbol == symbol)
                .OrderByDescending(s => s.Date)
                .ToListAsync();


        }

        //  שנה אחרונה
        [HttpGet("lastyear")]
        public async Task<ActionResult<IEnumerable<StockPrice>>> GetLastYear(string symbol)
        {
            var from = DateTime.Today.AddMonths(-12);

            return await _context.StockPrices
                .Where(s => s.Date >= from &&  s.Symbol == symbol)
                .OrderByDescending(s => s.Date)
                .ToListAsync();


        }




        [HttpPost("refresh/{symbol}")]
        public async Task<IActionResult> RefreshData(string symbol)
        {
            try
            {
                Console.WriteLine($"🔄 מנסה לרענן נתונים עבור הסמל: {symbol}");

                var data = await _alphaService.GetStockPrices(symbol);

                if (data == null || !data.Any())
                {
                    Console.WriteLine("⚠️ לא התקבלו נתונים מה-API.");
                    return BadRequest("No data fetched from Alpha Vantage.");
                }

                int added = 0;
                foreach (var price in data)
                {
                    bool exists = _context.StockPrices.Any(s => s.Date == price.Date &&  s.Symbol == price.Symbol);
                    if (!exists)
                    {
                        _context.StockPrices.Add(price);
                        added++;
                    }
                }

                await _context.SaveChangesAsync();
                Console.WriteLine($"✅ נוספו {added} רשומות חדשות.");

                return Ok("Data refreshed successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ שגיאה בעת ריענון הנתונים: {ex.Message}");
                return StatusCode(500, $"Error refreshing data: {ex.Message}");
            }
        }


    }
}

