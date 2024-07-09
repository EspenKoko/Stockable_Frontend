import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ErrorCode } from '../models/errorCodes';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class ErrorCodeService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getErrorCode(ErrorCodeId: number) {
    return this.httpClient.get(`${this.apiUrl}ErrorCode/GetErrorCode` + "/" + ErrorCodeId)
      .pipe(map(result => result))
  }

  getErrorCodes(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}ErrorCode/GetAllErrorCodes`)
      .pipe(map(result => result))
  }

  getErrorCodeByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}ErrorCode/SearchErrorCode/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addErrorCode(ErrorCode: ErrorCode): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}ErrorCode/AddErrorCode`, ErrorCode, this.apiService.httpOptions)
  }

  deleteErrorCode(ErrorCodeId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}ErrorCode/DeleteErrorCode` + "/" + ErrorCodeId, this.apiService.httpOptions)
  }

  editErrorCode(ErrorCodeId: number, ErrorCode: ErrorCode): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}ErrorCode/UpdateErrorCode/${ErrorCodeId}`, ErrorCode, this.apiService.httpOptions)
  }

}