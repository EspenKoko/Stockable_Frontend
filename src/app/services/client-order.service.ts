import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClientOrder } from '../models/clientOrders';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class ClientOrderService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getClientOrder(ClientOrderId: number) {
    return this.httpClient.get(`${this.apiUrl}ClientOrder/GetClientOrder` + "/" + ClientOrderId)
      .pipe(map(result => result))
  }

  getClientOrders(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}ClientOrder/GetAllClientOrders`)
      .pipe(map(result => result))
  }

  getClientOrderByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}ClientOrder/SearchClientOrder/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addClientOrder(ClientOrder: ClientOrder): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}ClientOrder/AddClientOrder`, ClientOrder, this.apiService.httpOptions)
  }

  deleteClientOrder(ClientOrderId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}ClientOrder/DeleteClientOrder` + "/" + ClientOrderId, this.apiService.httpOptions)
  }

  editClientOrder(ClientOrderId: number, ClientOrder: ClientOrder): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}ClientOrder/UpdateClientOrder/${ClientOrderId}`, ClientOrder, this.apiService.httpOptions)
  }

}