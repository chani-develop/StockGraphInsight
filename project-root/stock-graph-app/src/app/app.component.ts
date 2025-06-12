import { Component } from '@angular/core';
import { StockService } from './service/stock.service';
import { CompanyComponent } from "./Component/company/company.component";
import { DateComponent } from "./Component/date/date.component";
import { GraphComponent } from './Component/graph/graph.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CompanyComponent, DateComponent, GraphComponent ],
})
export class AppComponent {
selectedSymbol = 'GOOG'; // 
selectedRange = 'last30days';//
stockData:any[] =[];// מערך אובייקטים שמכיל תארך ומחיר קניה

constructor(private stockService: StockService) {}

onCompanyChange(symbol: string) {
  this.stockData = [];
  this.selectedSymbol = symbol;
  this.loadStockData(); // טוען את נתוני המניה
}

onRangeChange(range: string) {
  this.stockData = []; //מאתחל את המערך בכל פעם להיות ריק
  this.selectedRange = range;
  this.loadStockData();// טוען את נתוני המניה
}

loadStockData() {// טוען את נתוני המניה מהשירות
  this.stockData = []; //מאתחל את המערך בכל פעם להיות ריק
  if (this.selectedSymbol && this.selectedRange) {
    this.stockService.getStockData(this.selectedSymbol, this.selectedRange).subscribe(data => {
      this.stockData = data;
    });
  }
}
}