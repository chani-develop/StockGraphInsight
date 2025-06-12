using AlphaVantageApi.Models;
using Newtonsoft.Json.Linq;

namespace AlphaVantageApi.Services
{
    public class AlphaVantageService
    {
        private readonly HttpClient _httpClient;

        private const string ApiKey = "97FZVO3C18SSEG83";

        public AlphaVantageService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }



        public async Task<List<StockPrice>> GetStockPrices(string symbol)
        {


            var url = $"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={ApiKey}&outputsize=full";
            var response = await _httpClient.GetStringAsync(url);
            var data = JObject.Parse(response);
            var result = new List<StockPrice>();

            var timeSeries = data["Time Series (Daily)"];
            if (timeSeries != null)
            {
                foreach (KeyValuePair<string, JToken> item in (JObject)timeSeries)
                {
                    var date = DateTime.Parse(item.Key);
                    var priceData = item.Value;
                    result.Add(new StockPrice
                    {
                        Symbol = symbol,
                        Date = date,
                        Open = priceData["1. open"].Value<decimal>(),
                        High = priceData["2. high"].Value<decimal>(),
                        Low = priceData["3. low"].Value<decimal>(),
                        Close = priceData["4. close"].Value<decimal>(),
                        Volume = priceData["5. volume"].Value<long>()
                    });

                }
            }

            return result;
        }



















    }
}
