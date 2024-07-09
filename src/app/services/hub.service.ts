import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Hub } from '../models/hubs';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class HubService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getHub(HubId: number) {
    return this.httpClient.get(`${this.apiUrl}Hub/GetHub` + "/" + HubId)
      .pipe(map(result => result))
  }

  getHubByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}Hub/SearchHub/${name}`).pipe(
      map(result => result as any[])
    );
  }

  getHubs(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Hub/GetAllHubs`)
      .pipe(map(result => result))
  }

  addHub(Hub: Hub): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Hub/AddHub`, Hub, this.apiService.httpOptions)
  }

  deleteHub(HubId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}Hub/DeleteHub` + "/" + HubId, this.apiService.httpOptions)
  }

  editHub(HubId: number, Hub: Hub): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Hub/UpdateHub/${HubId}`, Hub, this.apiService.httpOptions)
  }

}
