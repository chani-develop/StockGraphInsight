import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


export interface StockData  {
  id: number;
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private baseUrl = 'https://localhost:7025/api/Stock';

  constructor(private http: HttpClient) {}


  getStockData(symbol: string, range: string): Observable<StockData[]> {
    let url = '';

    switch (range) {
      case 'today':
        url = `${this.baseUrl}/today/${symbol}`;
        break;
      case 'last30days':
        url = `${this.baseUrl}/last30days/${symbol}`;
        break;
      case 'last6months':
        url = `${this.baseUrl}/last6months/${symbol}`;
        break;
      case 'lastweek':
        url = `${this.baseUrl}/lastweek/${symbol}`;
        break;
      default:
        url = `${this.baseUrl}/${symbol}`;
    }

    return this.http.get<StockData[]>(url).pipe(
      catchError(this.handleError<StockData[]>('getStockData', []))
    );
  }
  //פונקציה שמטפלת בשגיאות
  //היא מקבלת את השם של הפונקציה שקרסה ואת התוצאה המוחזרת שלה
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  
}