import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HubUser } from '../models/hubUsers';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class HubUserService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getHubUser(HubUserId: number) {
    return this.httpClient.get(`${this.apiUrl}HubUser/GetHubUser` + "/" + HubUserId)
      .pipe(map(result => result))
  }

  getHubUsers(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}HubUser/GetAllHubUsers`)
      .pipe(map(result => result))
  }

  getHubUserByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}HubUser/SearchHubUser/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addHubUser(HubUser: HubUser): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}HubUser/AddHubUser`, HubUser, this.apiService.httpOptions)
  }

  deleteHubUser(HubUserId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}HubUser/DeleteHubUser` + "/" + HubUserId, this.apiService.httpOptions)
  }

  editHubUser(HubUserId: number, HubUser: HubUser): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}HubUser/UpdateHubUser/${HubUserId}`, HubUser, this.apiService.httpOptions)
  }

}