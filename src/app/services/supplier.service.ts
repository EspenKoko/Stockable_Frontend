import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Supplier } from '../models/suppliers';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class SupplierService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getSupplier(SupplierId: number) {
    return this.httpClient.get(`${this.apiUrl}Supplier/GetSupplier` + "/" + SupplierId)
      .pipe(map(result => result))
  }

  getSuppliers(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Supplier/GetAllSupplier`)
      .pipe(map(result => result))
  }

  getSupplierByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}Supplier/SearchSupplier/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addSupplier(Supplier: Supplier): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Supplier/AddSupplier`, Supplier, this.apiService.httpOptions)
  }

  deleteSupplier(SupplierId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}Supplier/DeleteSupplier` + "/" + SupplierId, this.apiService.httpOptions)
  }

  editSupplier(SupplierId: number, Supplier: Supplier): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Supplier/UpdateSupplier/${SupplierId}`, Supplier, this.apiService.httpOptions)
  }

}