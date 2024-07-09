import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SupplierOrderStatus } from '../models/supplierOrderStatuses';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class SupplierOrderStatusService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getSupplierOrderStatus(SupplierOrderStatusId: number) {
    return this.httpClient.get(`${this.apiUrl}SupplierOrderStatus/GetSupplierOrderStatus` + "/" + SupplierOrderStatusId).pipe(map(result => result))
  }

  getSupplierOrderStatusByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}SupplierOrderStatus/SearchSupplierOrderStatus/${name}`).pipe(
      map(result => result as any[])
    );
  }
  
  getSupplierOrderStatuses(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}SupplierOrderStatus/GetSupplierOrderStatuses`).pipe(map(result => result))
  }

  addSupplierOrderStatus(SupplierOrderStatus: SupplierOrderStatus): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}SupplierOrderStatus/AddSupplierOrderStatus`, SupplierOrderStatus
   , this.apiService.httpOptions)
  }

  deleteSupplierOrderStatus(SupplierOrderStatusId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}SupplierOrderStatus/DeleteSupplierOrderStatus` + "/" + SupplierOrderStatusId, this.apiService.httpOptions)
  }

  editSupplierOrderStatus(SupplierOrderStatusId: number, SupplierOrderStatus: SupplierOrderStatus): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}SupplierOrderStatus/UpdateSupplierOrderStatus/${SupplierOrderStatusId}`, SupplierOrderStatus, this.apiService.httpOptions)
  }
}
