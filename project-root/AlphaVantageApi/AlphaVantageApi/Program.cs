


using AlphaVantageApi.Data;
using AlphaVantageApi.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<StockContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpClient<AlphaVantageService>();
builder.Services.AddScoped<AlphaVantageService>();

// ✅ הוספת מדיניות CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost4200", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ✅ הפעלת CORS לפני authorization
app.UseCors("AllowLocalhost4200");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
