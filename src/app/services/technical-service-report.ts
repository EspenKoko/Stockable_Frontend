import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TechnicalServiceReport } from '../models/technicalServiceReports';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class TechnicalServiceReportService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getTechnicalServiceReport(TechnicalServiceReportId: number) {
    return this.httpClient.get(`${this.apiUrl}TechnicalServiceReport/GetTechnicalServiceReport` + "/" + TechnicalServiceReportId).pipe(map(result => result))
  }

  getTechnicalServiceReportByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}TechnicalServiceReport/SearchTechnicalServiceReport/${name}`).pipe(
      map(result => result as any[])
    );
  }

  getTechnicalServiceReports(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}TechnicalServiceReport/GetAllTechnicalServiceReports`).pipe(map(result => result))
  }

  addTechnicalServiceReport(TechnicalServiceReport: TechnicalServiceReport): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}TechnicalServiceReport/AddTechnicalServiceReport`, TechnicalServiceReport, this.apiService.httpOptions)
  }

  deleteTechnicalServiceReport(TechnicalServiceReportId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}TechnicalServiceReport/DeleteTechnicalServiceReport` + "/" + TechnicalServiceReportId, this.apiService.httpOptions)
  }

  editTechnicalServiceReport(TechnicalServiceReportId: number, TechnicalServiceReport: TechnicalServiceReport): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}TechnicalServiceReport/UpdateTechnicalServiceReport/${TechnicalServiceReportId}`, TechnicalServiceReport, this.apiService.httpOptions)
  }
}
