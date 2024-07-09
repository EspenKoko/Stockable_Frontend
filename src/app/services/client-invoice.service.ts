import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClientInvoice } from '../models/clientInvoices';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class ClientInvoiceService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getClientInvoice(ClientInvoiceId: number) {
    return this.httpClient.get(`${this.apiUrl}ClientInvoice/GetClientInvoice` + "/" + ClientInvoiceId)
      .pipe(map(result => result))
  }

  getClientInvoices(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}ClientInvoice/GetAllClientInvoices`)
      .pipe(map(result => result))
  }

  getClientInvoiceByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}ClientInvoice/SearchClientInvoice/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addClientInvoice(ClientInvoice: ClientInvoice): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}ClientInvoice/AddClientInvoice`, ClientInvoice, this.apiService.httpOptions)
  }

  deleteClientInvoice(ClientInvoiceId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}ClientInvoice/DeleteClientInvoice` + "/" + ClientInvoiceId, this.apiService.httpOptions)
  }

  editClientInvoice(ClientInvoiceId: number, ClientInvoice: ClientInvoice): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}ClientInvoice/UpdateClientInvoice/${ClientInvoiceId}`, ClientInvoice, this.apiService.httpOptions)
  }

}