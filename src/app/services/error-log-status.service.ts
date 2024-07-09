import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ErrorLogStatus } from '../models/errorLogStatuses';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class ErrorLogStatusService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getErrorLogStatus(ErrorLogStatusId: number) {
    return this.httpClient.get(`${this.apiUrl}ErrorLogStatus/GetErrorLogStatus` + "/" + ErrorLogStatusId)
      .pipe(map(result => result))
  }

  getErrorLogStatuses(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}ErrorLogStatus/GetAllErrorLogStatus`)
      .pipe(map(result => result))
  }

  getErrorLogStatusByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}ErrorLogStatus/SearchErrorLogStatus/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addErrorLogStatus(ErrorLogStatus: ErrorLogStatus): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}ErrorLogStatus/AddErrorLogStatus`, ErrorLogStatus, this.apiService.httpOptions)
  }

  deleteErrorLogStatus(ErrorLogStatusId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}ErrorLogStatus/DeleteErrorLogStatus` + "/" + ErrorLogStatusId, this.apiService.httpOptions)
  }

  editErrorLogStatus(ErrorLogStatusId: number, ErrorLogStatus: ErrorLogStatus): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}ErrorLogStatus/UpdateErrorLogStatus/${ErrorLogStatusId}`, ErrorLogStatus, this.apiService.httpOptions)
  }

}