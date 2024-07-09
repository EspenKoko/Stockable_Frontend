import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Client } from '../models/clients';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getClient(ClientId: number) {
    return this.httpClient.get(`${this.apiUrl}Client/GetClient` + "/" + ClientId)
      .pipe(map(result => result))
  }

  getClientByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}Client/SearchClient/${name}`).pipe(
      map(result => result as any[])
    );
  }

  getClients(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Client/GetAllClients`)
      .pipe(map(result => result))
  }

  addClient(Client: Client): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Client/AddClient`, Client, this.apiService.httpOptions)
  }

  deleteClient(ClientId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}Client/DeleteClient` + "/" + ClientId, this.apiService.httpOptions)
  }

  editClient(ClientId: number, Client: Client): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Client/UpdateClient/${ClientId}`, Client, this.apiService.httpOptions)
  }

}
