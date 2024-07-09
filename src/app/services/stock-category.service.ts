import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { StockCategory } from '../models/stockCategories';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class StockCategoryService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getStockCategory(StockCategoryId: number) {
    return this.httpClient.get(`${this.apiUrl}StockCategory/GetStockCategory` + "/" + StockCategoryId).pipe(map(result => result))
  }
  
  getStockCategoryByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}StockCategory/SearchStockCategory/${name}`).pipe(
      map(result => result as any[])
    );
  }

  getStockCategories(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}StockCategory/GetAllStockCategories`).pipe(map(result => result))
  }

  addStockCategory(StockCategory: StockCategory): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}StockCategory/AddStockCategory`, StockCategory, this.apiService.httpOptions)
  }

  deleteStockCategory(StockCategoryId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}StockCategory/DeleteStockCategory` + "/" + StockCategoryId, this.apiService.httpOptions)
  }

  editStockCategory(StockCategoryId: number, StockCategory: StockCategory): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}StockCategory/UpdateStockCategory/${StockCategoryId}`, StockCategory, this.apiService.httpOptions)
  }
}
