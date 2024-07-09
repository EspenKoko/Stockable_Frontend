import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Help } from '../models/help';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class HelpService {
  private apiUrl = this.apiService.apiUrl;
  private routeList: any[] = [];

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getFAQ(HelpId: number) {
    return this.httpClient.get(`${this.apiUrl}Help/GetHelp` + "/" + HelpId)
      .pipe(map(result => result))
  }

  getFAQByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}Help/SearchHelp/${name}`).pipe(
      map(result => result as any[])
    );
  }

  getFAQs(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Help/GetAllHelps`)
      .pipe(map(result => result))
  }

  addFAQ(Help: Help): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Help/AddHelp`, Help, this.apiService.httpOptions)
  }

  deleteFAQ(HelpId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}Help/DeleteHelp` + "/" + HelpId, this.apiService.httpOptions)
  }

  editFAQ(HelpId: number, Help: Help): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Help/UpdateHelp/${HelpId}`, Help, this.apiService.httpOptions)
  }

  addRoute(route: string) {
    this.routeList.push(route);
  }

  removeLastRoute() {
    this.routeList.pop();
  }

  getRouteList() {
    return this.routeList;
  }
}
