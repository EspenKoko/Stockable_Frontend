import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClientUserRequest } from '../models/clientUserRequests';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class ClientUserRequestService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getClientUserRequest(ClientUserRequestId: number) {
    return this.httpClient.get(`${this.apiUrl}ClientUserRequest/GetClientUserRequest` + "/" + ClientUserRequestId)
      .pipe(map(result => result))
  }

  getClientUserRequests(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}ClientUserRequest/GetAllClientUserRequests`)
      .pipe(map(result => result))
  }

  getClientUserRequestByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}ClientUserRequest/SearchClientUserRequest/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addClientUserRequest(ClientUserRequest: ClientUserRequest): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}ClientUserRequest/AddClientUserRequest`, ClientUserRequest, this.apiService.httpOptions)
  }

  deleteClientUserRequest(ClientUserRequestId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}ClientUserRequest/DeleteClientUserRequest` + "/" + ClientUserRequestId, this.apiService.httpOptions)
  }

  editClientUserRequest(ClientUserRequestId: number, ClientUserRequest: ClientUserRequest): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}ClientUserRequest/UpdateClientUserRequest/${ClientUserRequestId}`, ClientUserRequest, this.apiService.httpOptions)
  }

}