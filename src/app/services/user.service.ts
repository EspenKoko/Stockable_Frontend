import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../models/users';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getUser(UserId: number) {
    return this.httpClient.get(`${this.apiUrl}User/GetUser` + "/" + UserId)
      .pipe(map(result => result))
  }

  getUsers(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}User/GetAllUsers`)
      .pipe(map(result => result))
  }

  getUserByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}User/SearchUser/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addUser(User: User) {
    return this.httpClient.post(`${this.apiUrl}User/AddUser`, User, this.apiService.httpOptions)
  }

  deleteUser(UserId: Number) {
    return this.httpClient.delete<string>(`${this.apiUrl}User/DeleteUser` + "/" + UserId, this.apiService.httpOptions)
  }

  editUser(UserId: number, User: User) {
    return this.httpClient.put(`${this.apiUrl}User/UpdateUser/${UserId}`, User, this.apiService.httpOptions)
  }

}