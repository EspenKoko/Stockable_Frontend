import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { City } from '../models/cities';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getCity(CityId: number) {
    return this.httpClient.get(`${this.apiUrl}City/GetCity` + "/" + CityId)
      .pipe(map(result => result))
  }

  getCityByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}City/SearchCity/${name}`).pipe(
      map(result => result as any[])
    );
  }

  getCities(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}City/GetAllCities`)
      .pipe(map(result => result))
  }

  addCity(City: City): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}City/AddCity`, City, this.apiService.httpOptions)
  }

  deleteCity(CityId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}City/DeleteCity` + "/" + CityId, this.apiService.httpOptions)
  }

  editCity(CityId: number, City: City): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}City/UpdateCity/${CityId}`, City, this.apiService.httpOptions)
  }

}
