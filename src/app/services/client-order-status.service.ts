import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClientOrderStatus } from '../models/clientOrderStatuses';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class ClientOrderStatusService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getClientOrderStatus(ClientOrderStatusId: number) {
    return this.httpClient.get(`${this.apiUrl}ClientOrderStatus/GetClientOrderStatus` + "/" + ClientOrderStatusId)
      .pipe(map(result => result))
  }

  getClientOrderStatuses(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}ClientOrderStatus/GetAllClientOrderStatuses`)
      .pipe(map(result => result))
  }

  getClientOrderStatusByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}ClientOrderStatus/SearchClientOrderStatus/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addClientOrderStatus(ClientOrderStatus: ClientOrderStatus): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}ClientOrderStatus/AddClientOrderStatus`, ClientOrderStatus, this.apiService.httpOptions)
  }

  deleteClientOrderStatus(ClientOrderStatusId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}ClientOrderStatus/DeleteClientOrderStatus` + "/" + ClientOrderStatusId, this.apiService.httpOptions)
  }

  editClientOrderStatus(ClientOrderStatusId: number, ClientOrderStatus: ClientOrderStatus): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}ClientOrderStatus/UpdateClientOrderStatus/${ClientOrderStatusId}`, ClientOrderStatus, this.apiService.httpOptions)
  }

}