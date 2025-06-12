using System;

namespace AlphaVantageApi.Models
{
    public class StockPrice
    {
        public int Id { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public decimal Open { get; set; }
        public decimal High { get; set; }
        public decimal Low { get; set; }
        public decimal Close { get; set; }
        public long Volume { get; set; }

        public StockPrice() { }

        public StockPrice(string symbol, DateTime date, decimal open, decimal high, decimal low, decimal close, long volume)
        {
            Symbol = symbol;
            Date = date;
            Open = open;
            High = high;
            Low = low;
            Close = close;
            Volume = volume;
        }
    }
}
