import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClientOrderStock } from '../models/clientOrderStock';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class ClientOrderStockService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getClientOrderStock(ClientOrderStockId: number) {
    return this.httpClient.get(`${this.apiUrl}CLientOrderStock/GetClientOrderStock` + "/" + ClientOrderStockId)
      .pipe(map(result => result))
  }

  getClientOrderStocks(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}CLientOrderStock/GetAllClientOrderStocks`)
      .pipe(map(result => result))
  }

  getClientOrderStockByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}CLientOrderStock/SearchClientOrderStock/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addClientOrderStock(ClientOrderStock: ClientOrderStock): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}CLientOrderStock/AddClientOrderStock`, ClientOrderStock, this.apiService.httpOptions)
  }

  deleteClientOrderStock(ClientOrderStockId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}CLientOrderStock/DeleteClientOrderStock` + "/" + ClientOrderStockId, this.apiService.httpOptions)
  }

  editClientOrderStock(ClientOrderStockId: number, ClientOrderStock: ClientOrderStock): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}CLientOrderStock/UpdateClientOrderStock/${ClientOrderStockId}`, ClientOrderStock, this.apiService.httpOptions)
  }

  // fix all spelling to not having uppercase L in api url
}