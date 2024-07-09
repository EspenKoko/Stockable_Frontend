import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Province } from '../models/provinces';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getProvince(ProvinceId: number) {
    return this.httpClient.get(`${this.apiUrl}Province/GetProvince` + "/" + ProvinceId).pipe(map(result => result))
  }

  getProvinceByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}Province/SearchProvince/${name}`).pipe(
      map(result => result as any[])
    );
  }

  getProvinces(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Province/GetAllProvinces`).pipe(map(result => result))
  }

  addProvince(Province: Province): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Province/AddProvince`, Province, this.apiService.httpOptions)
  }

  deleteProvince(ProvinceId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}Province/DeleteProvince` + "/" + ProvinceId, this.apiService.httpOptions)
  }

  editProvince(ProvinceId: number, Province: Province): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Province/UpdateProvince/${ProvinceId}`, Province, this.apiService.httpOptions)
  }

}
