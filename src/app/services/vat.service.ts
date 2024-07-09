import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Vat } from '../models/vat';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class VatService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getVat(VatId: number) {
    return this.httpClient.get(`${this.apiUrl}Vat/GetVat` + "/" + VatId).pipe(map(result => result))
  }

  getVats(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Vat/GetAllVats`).pipe(map(result => result))
  }

  addVat(Vat: Vat): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Vat/AddVat`, Vat, this.apiService.httpOptions)
  }

  deleteVat(VatId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}Vat/DeleteVat` + "/" + VatId, this.apiService.httpOptions)
  }

  editVat(VatId: number, Vat: Vat): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Vat/UpdateVat/${VatId}`, Vat, this.apiService.httpOptions)
  }
}
