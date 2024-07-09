import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TransitPrinter } from '../models/transit-printer';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class TransitPrinterService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getTransitPrinter(TransitPrinterId: number) {
    return this.httpClient.get(`${this.apiUrl}TransitPrinter/GetTransitPrinter` + "/" + TransitPrinterId).pipe(map(result => result))
  }

  getTransitPrinters(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}TransitPrinter/GetAllTransitPrinters`).pipe(map(result => result))
  }

  addTransitPrinter(TransitPrinter: TransitPrinter): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}TransitPrinter/AddTransitPrinter`, TransitPrinter, this.apiService.httpOptions)
  }

  deleteVat(TransitPrinterId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}TransitPrinter/TransitPrinterVat` + "/" + TransitPrinterId, this.apiService.httpOptions)
  }

  editVat(TransitPrinterId: number, TransitPrinter: TransitPrinter): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}TransitPrinter/TransitPrinterVat/${TransitPrinterId}`, TransitPrinter, this.apiService.httpOptions)
  }
  searchTransitPrinter(SearchString: string) {
    return this.httpClient.get(`${this.apiUrl}TransitPrinter/SearchTransitPrinter` + "/" + SearchString).pipe(map(result => result))
  }
}