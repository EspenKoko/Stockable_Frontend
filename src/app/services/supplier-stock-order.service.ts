import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { StockSupplierOrder } from '../models/stockSupplierOrder';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class StockSupplierOrderService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getStockSupplierOrder(StockSupplierOrderId: number) {
    return this.httpClient.get(`${this.apiUrl}StockSupplierOrder/GetStockSupplierOrder` + "/" + StockSupplierOrderId).pipe(map(result => result))
  }

  getStockSupplierOrderByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}StockSupplierOrder/SearchStockSupplierOrder/${name}`).pipe(
      map(result => result as any[])
    );
  }
  
  getStockSupplierOrders(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}StockSupplierOrder/GetAllStockSupplierOrders`).pipe(map(result => result))
  }

  addStockSupplierOrder(StockSupplierOrder: StockSupplierOrder): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}StockSupplierOrder/AddStockSupplierOrder`, StockSupplierOrder
   , this.apiService.httpOptions)
  }

  deleteStockSupplierOrder(StockSupplierOrderId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}StockSupplierOrder/DeleteStockSupplierOrder` + "/" + StockSupplierOrderId, this.apiService.httpOptions)
  }

  editStockSupplierOrder(StockSupplierOrderId: number, StockSupplierOrder: StockSupplierOrder): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}StockSupplierOrder/UpdateStockSupplierOrder/${StockSupplierOrderId}`, StockSupplierOrder, this.apiService.httpOptions)
  }
}
