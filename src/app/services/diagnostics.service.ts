import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Diagnostics } from '../models/diagnostics';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticsService {
  private apiUrl = this.apiService.apiUrl;


  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getDiagnostic(DiagnosticsId: number) {
    return this.httpClient.get(`${this.apiUrl}Diagnostics/GetDiagnostics` + "/" + DiagnosticsId)
      .pipe(map(result => result))
  }

  getDiagnosticByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}Diagnostics/SearchDiagnostics/${name}`).pipe(
      map(result => result as any[])
    );
  }

  getDiagnostics(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Diagnostics/GetAllDiagnosticss`)
      .pipe(map(result => result))
  }

  addDiagnostic(Diagnostics: Diagnostics): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Diagnostics/AddDiagnostics`, Diagnostics, this.apiService.httpOptions)
  }

  deleteDiagnostic(DiagnosticsId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}Diagnostics/DeleteDiagnostics` + "/" + DiagnosticsId, this.apiService.httpOptions)
  }

  editDiagnostic(DiagnosticsId: number, Diagnostics: Diagnostics): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Diagnostics/UpdateDiagnostics/${DiagnosticsId}`, Diagnostics, this.apiService.httpOptions)
  }

}
