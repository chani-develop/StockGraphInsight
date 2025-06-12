using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using AlphaVantageApi.Models;

namespace AlphaVantageApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IConfiguration _config;

        public EmailController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("send")]
        public IActionResult SendEmail([FromBody] EmailRequest request)
        {
            Console.WriteLine($"=== Email Received ===");
            Console.WriteLine($"Email: {request.Email}");
            Console.WriteLine($"ImageBase64 starts with: {request.ImageBase64?.Substring(0, 30)}");

            try
            {
                Console.WriteLine("ImageBase64: " + request.ImageBase64);

                var base64Data = request.ImageBase64.Split(',')[1];
                var imageBytes = Convert.FromBase64String(base64Data);

                var attachment = new Attachment(new MemoryStream(imageBytes), "chart.png", "image/png");

                var fromEmail = _config["EmailSettings:From"];
                var displayName = _config["EmailSettings:DisplayName"];
                var password = _config["EmailSettings:Password"];
                var host = _config["EmailSettings:Host"];
                var port = int.Parse(_config["EmailSettings:Port"]);

                var fromAddress = new MailAddress(fromEmail, displayName);
                var toAddress = new MailAddress(request.Email);

                using var smtp = new SmtpClient
                {
                    Host = host,
                    Port = port,
                    EnableSsl = true,
                    Credentials = new NetworkCredential(fromAddress.Address, password)
                };

                using var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = "הגרף שביקשת",
                    Body = "מצורף קובץ הגרף שלך."
                };

                message.Attachments.Add(attachment);
                smtp.Send(message);

                return Ok(new { message = "Email sent successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"שגיאה בשליחה: {ex}");
                return StatusCode(500, $"שגיאה בשליחה: {ex.Message}");
            }
        }
    }
}
