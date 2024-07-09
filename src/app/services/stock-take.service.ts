import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { StockTake } from '../models/stockTake';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class StockTakeService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getStockTake(StockTakeId: number) {
    return this.httpClient.get(`${this.apiUrl}StockTake/GetStockTake` + "/" + StockTakeId).pipe(map(result => result))
  }

  getStockTakeByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}StockTake/SearchStockTake/${name}`).pipe(
      map(result => result as any[])
    );
  }

  getStockTakes(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}StockTake/GetAllStockTakes`).pipe(map(result => result))
  }

  addStockTake(StockTake: StockTake): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}StockTake/AddStockTake`, StockTake, this.apiService.httpOptions)
  }

  deleteStockTake(StockTakeId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}StockTake/DeleteStockTake` + "/" + StockTakeId, this.apiService.httpOptions)
  }

  editStockTake(StockTakeId: number, StockTake: StockTake): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}StockTake/UpdateStockTake/${StockTakeId}`, StockTake, this.apiService.httpOptions)
  }
}
