import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PurchaseOrder } from '../models/purchaseOrder';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class PurchaseOrderService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getPurchaseOrder(PurchaseOrderId: number) {
    return this.httpClient.get(`${this.apiUrl}PurchaseOrder/GetPurchaseOrder` + "/" + PurchaseOrderId)
      .pipe(map(result => result))
  }

  getPurchaseOrders(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}PurchaseOrder/GetAllPurchaseOrders`)
      .pipe(map(result => result))
  }

  getPurchaseOrderByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}PurchaseOrder/SearchPurchaseOrder/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addPurchaseOrder(PurchaseOrder: PurchaseOrder): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}PurchaseOrder/AddPurchaseOrder`, PurchaseOrder, this.apiService.httpOptions)
  }

  deletePurchaseOrder(PurchaseOrderId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}PurchaseOrder/DeletePurchaseOrder` + "/" + PurchaseOrderId, this.apiService.httpOptions)
  }

  editPurchaseOrder(PurchaseOrderId: number, PurchaseOrder: PurchaseOrder): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}PurchaseOrder/UpdatePurchaseOrder/${PurchaseOrderId}`, PurchaseOrder, this.apiService.httpOptions)
  }

}