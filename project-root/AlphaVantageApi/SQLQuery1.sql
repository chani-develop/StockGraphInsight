-- כמה שורות יש בטבלה?
SELECT COUNT(*) AS NumRows
  FROM dbo.StockPrices;

-- אילו תאריכים יש ברשומות (10 הראשונים מהחדשים ביותר)?
SELECT TOP 10 [Date], Symbol
  FROM dbo.StockPrices
 ORDER BY [Date] DESC;
