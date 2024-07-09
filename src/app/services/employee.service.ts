import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Employee } from '../models/employees';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getEmployee(EmployeeId: number) {
    return this.httpClient.get(`${this.apiUrl}Employee/GetEmployee` + "/" + EmployeeId)
      .pipe(map(result => result))
  }

  getEmployees(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Employee/GetAllEmployees`)
      .pipe(map(result => result))
  }

  getEmployeeByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}Employee/SearchEmployee/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addEmployee(Employee: Employee): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Employee/AddEmployee`, Employee, this.apiService.httpOptions)
  }

  deleteEmployee(EmployeeId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}Employee/DeleteEmployee` + "/" + EmployeeId, this.apiService.httpOptions)
  }

  editEmployee(EmployeeId: number, Employee: Employee): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Employee/UpdateEmployee/${EmployeeId}`, Employee, this.apiService.httpOptions)
  }

}