import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { StockTakeStock } from '../models/stockTakeStock';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class StockTakeStockService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getStockTakeStock(StockTakeStockId: number) {
    return this.httpClient.get(`${this.apiUrl}StockTakeStock/GetStockTakeStock` + "/" + StockTakeStockId).pipe(map(result => result))
  }

  getStockTakeStockByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}StockTakeStock/SearchStockTakeStock/${name}`).pipe(
      map(result => result as any[])
    );
  }

  getStockTakeStocks(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}StockTakeStock/GetAllStockTakeStocks`).pipe(map(result => result))
  }

  addStockTakeStock(StockTakeStock: StockTakeStock): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}StockTakeStock/AddStockTakeStock`, StockTakeStock, this.apiService.httpOptions)
  }

  deleteStockTakeStock(StockTakeStockId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}StockTakeStock/DeleteStockTakeStock` + "/" + StockTakeStockId, this.apiService.httpOptions)
  }

  editStockTakeStock(StockTakeStockId: number, StockTakeStock: StockTakeStock): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}StockTakeStock/UpdateStockTakeStock/${StockTakeStockId}`, StockTakeStock, this.apiService.httpOptions)
  }
}
