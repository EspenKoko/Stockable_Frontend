import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PartsRequest } from '../models/partsRequest';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class PartsRequestService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getPartsRequest(PartsRequestId: number) {
    return this.httpClient.get(`${this.apiUrl}PartsRequest/GetPartsRequest` + "/" + PartsRequestId).pipe(map(result => result))
  }

  getPartsRequestByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}PartsRequest/SearchPartsRequest/${name}`).pipe(
      map(result => result as any[])
    );
  }

  getPartsRequests(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}PartsRequest/GetAllPartsRequest`).pipe(map(result => result))
  }

  addPartsRequest(PartsRequest: PartsRequest): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}PartsRequest/AddPartsRequest`, PartsRequest, this.apiService.httpOptions)
  }

  deletePartsRequest(PartsRequestId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}PartsRequest/DeletePartsRequest` + "/" + PartsRequestId, this.apiService.httpOptions)
  }

  editPartsRequest(PartsRequestId: number, PartsRequest: PartsRequest): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}PartsRequest/UpdatePartsRequest/${PartsRequestId}`, PartsRequest, this.apiService.httpOptions)
  }
}
