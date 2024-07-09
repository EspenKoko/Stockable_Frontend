import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PrinterStatus } from '../models/printerStatuses';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class PrinterStatusService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getPrinterStatus(PrinterStatusId: number) {
    return this.httpClient.get(`${this.apiUrl}PrinterStatus/GetPrinterStatus` + "/" + PrinterStatusId)
      .pipe(map(result => result))
  }

  getPrinterStatuses(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}PrinterStatus/GetAllPrinterStatus`)
      .pipe(map(result => result))
  }

  getPrinterStatusByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}PrinterStatus/SearchPrinterStatus/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addPrinterStatus(PrinterStatus: PrinterStatus): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}PrinterStatus/AddPrinterStatus`, PrinterStatus, this.apiService.httpOptions)
  }

  deletePrinterStatus(PrinterStatusId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}PrinterStatus/DeletePrinterStatus` + "/" + PrinterStatusId, this.apiService.httpOptions)
  }

  editPrinterStatus(PrinterStatusId: number, PrinterStatus: PrinterStatus): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}PrinterStatus/UpdatePrinterStatus/${PrinterStatusId}`, PrinterStatus, this.apiService.httpOptions)
  }

}