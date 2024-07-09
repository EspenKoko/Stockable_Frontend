import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EmployeeType } from '../models/employeeTypes';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class EmployeeTypeService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getEmployeeType(EmployeeTypeId: number) {
    return this.httpClient.get(`${this.apiUrl}EmployeeType/GetEmployeeType` + "/" + EmployeeTypeId)
      .pipe(map(result => result))
  }

  getEmployeeTypeByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}EmployeeType/SearchEmployeeType/${name}`).pipe(
      map(result => result as any[])
    );
  }

  getEmployeeTypes(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}EmployeeType/GetAllEmployeeTypes`)
      .pipe(map(result => result))
  }

  addEmployeeType(EmployeeType: EmployeeType): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}EmployeeType/AddEmployeeType`, EmployeeType, this.apiService.httpOptions)
  }

  deleteEmployeeType(EmployeeTypeId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}EmployeeType/DeleteEmployeeType` + "/" + EmployeeTypeId, this.apiService.httpOptions)
  }

  editEmployeeType(EmployeeTypeId: number, EmployeeType: EmployeeType): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}EmployeeType/UpdateEmployeeType/${EmployeeTypeId}`, EmployeeType, this.apiService.httpOptions)
  }

  getEmployeeTypesFromStoredProcedure(): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}EmployeeType/GetAllEmployeeTypesFromStoredProcedure`)
      .pipe(map(result => result as any[]));
  }
}
