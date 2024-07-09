import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AssignedPrinter } from '../models/AssignedPrinters';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class AssignedPrinterService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getAssignedPrinter(AssignedPrinterId: number) {
    return this.httpClient.get(`${this.apiUrl}AssignedPrinter/GetPrinter` + "/" + AssignedPrinterId)
      .pipe(map(result => result))
  }

  getAssignedPrinterByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}AssignedPrinter/SearchPrinter/${name}`).pipe(
      map(result => result as any[])
    );
  }

  getAssignedPrinters(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}AssignedPrinter/GetAllPrinters`)
      .pipe(map(result => result))
  }

  addAssignedPrinter(AssignedPrinter: AssignedPrinter): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}AssignedPrinter/AddPrinter`, AssignedPrinter, this.apiService.httpOptions)
  }

  deleteAssignedPrinter(AssignedPrinterId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}AssignedPrinter/DeletePrinter` + "/" + AssignedPrinterId, this.apiService.httpOptions)
  }

  editAssignedPrinter(AssignedPrinterId: number, AssignedPrinter: AssignedPrinter): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}AssignedPrinter/UpdatePrinter/${AssignedPrinterId}`, AssignedPrinter, this.apiService.httpOptions)
  }
}
