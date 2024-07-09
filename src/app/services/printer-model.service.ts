import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PrinterModel } from '../models/printerModels';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class PrinterModelService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getPrinterModel(PrinterModelId: number) {
    return this.httpClient.get(`${this.apiUrl}PrinterModel/GetPrinterModel` + "/" + PrinterModelId)
      .pipe(map(result => result))
  }

  getPrinterModels(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}PrinterModel/GetAllPrinterModels`)
      .pipe(map(result => result))
  }

  getPrinterModelByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}PrinterModel/SearchPrinterModel/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addPrinterModel(PrinterModel: PrinterModel): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}PrinterModel/AddPrinterModel`, PrinterModel, this.apiService.httpOptions)
  }

  deletePrinterModel(PrinterModelId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}PrinterModel/DeletePrinterModel` + "/" + PrinterModelId, this.apiService.httpOptions)
  }

  editPrinterModel(PrinterModelId: number, PrinterModel: PrinterModel): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}PrinterModel/UpdatePrinterModel/${PrinterModelId}`, PrinterModel, this.apiService.httpOptions)
  }

}