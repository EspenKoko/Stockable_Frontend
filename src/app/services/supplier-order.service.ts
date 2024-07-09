import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SupplierOrder } from '../models/supplierOrders';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class SupplierOrderService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getSupplierOrder(SupplierOrderId: number) {
    return this.httpClient.get(`${this.apiUrl}SupplierOrder/GetSupplierOrder` + "/" + SupplierOrderId).pipe(map(result => result))
  }

  getSupplierOrderByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}SupplierOrder/SearchSupplierOrder/${name}`).pipe(
      map(result => result as any[])
    );
  }
  
  getSupplierOrders(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}SupplierOrder/GetAllSupplierOrders`).pipe(map(result => result))
  }

  addSupplierOrder(SupplierOrder: SupplierOrder): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}SupplierOrder/AddSupplierOrder`, SupplierOrder
   , this.apiService.httpOptions)
  }

  deleteSupplierOrder(SupplierOrderId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}SupplierOrder/DeleteSupplierOrder` + "/" + SupplierOrderId, this.apiService.httpOptions)
  }

  editSupplierOrder(SupplierOrderId: number, SupplierOrder: SupplierOrder): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}SupplierOrder/UpdateSupplierOrder/${SupplierOrderId}`, SupplierOrder, this.apiService.httpOptions)
  }
}
