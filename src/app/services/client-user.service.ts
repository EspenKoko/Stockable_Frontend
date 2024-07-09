import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClientUser } from '../models/clientUsers';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class ClientUserService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getClientUser(ClientUserId: number) {
    return this.httpClient.get(`${this.apiUrl}ClientUser/GetClientUser` + "/" + ClientUserId)
      .pipe(map(result => result))
  }

  getClientUsers(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}ClientUser/GetAllClientUsers`)
      .pipe(map(result => result))
  }

  getClientUserByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}ClientUser/SearchClientUser/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addClientUser(ClientUser: ClientUser): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}ClientUser/AddClientUser`, ClientUser, this.apiService.httpOptions)
  }

  deleteClientUser(ClientUserId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}ClientUser/DeleteClientUser` + "/" + ClientUserId, this.apiService.httpOptions)
  }

  editClientUser(ClientUserId: number, ClientUser: ClientUser): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}ClientUser/UpdateClientUser/${ClientUserId}`, ClientUser, this.apiService.httpOptions)
  }

}