import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { StockType } from '../models/stockTypes';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class StockTypeService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getStockType(StockTypeId: number) {
    return this.httpClient.get(`${this.apiUrl}StockType/GetStockType` + "/" + StockTypeId).pipe(map(result => result))
  }

  getStockTypeByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}StockType/SearchStockType/${name}`).pipe(
      map(result => result as any[])
    );
  }
  
  getStockTypes(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}StockType/GetStockTypes`).pipe(map(result => result))
  }

  addStockType(StockType: StockType): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}StockType/AddStockType`, StockType, this.apiService.httpOptions)
  }

  deleteStockType(StockTypeId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}StockType/DeleteStockType` + "/" + StockTypeId, this.apiService.httpOptions)
  }

  editStockType(StockTypeId: number, StockType: StockType): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}StockType/UpdateStockType/${StockTypeId}`, StockType, this.apiService.httpOptions)
  }
}
