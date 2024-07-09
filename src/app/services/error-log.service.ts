import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ErrorLog } from '../models/errorLogs';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class ErrorLogService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getErrorLog(ErrorLogId: number) {
    return this.httpClient.get(`${this.apiUrl}ErrorLog/GetErrorLog` + "/" + ErrorLogId)
      .pipe(map(result => result))
  }

  getErrorLogs(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}ErrorLog/GetAllErrorLogs`)
      .pipe(map(result => result))
  }

  getErrorLogByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}ErrorLog/SearchErrorLog/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addErrorLog(ErrorLog: ErrorLog): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}ErrorLog/AddErrorLog`, ErrorLog, this.apiService.httpOptions)
  }

  deleteErrorLog(ErrorLogId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}ErrorLog/DeleteErrorLog` + "/" + ErrorLogId, this.apiService.httpOptions)
  }

  editErrorLog(ErrorLogId: number, ErrorLog: ErrorLog): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}ErrorLog/UpdateErrorLog/${ErrorLogId}`, ErrorLog, this.apiService.httpOptions)
  }

}