import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Markup } from '../models/markup';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class MarkupService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getMarkup(MarkupId: number) {
    return this.httpClient.get(`${this.apiUrl}Markup/GetMarkup` + "/" + MarkupId).pipe(map(result => result))
  }

  getMarkups(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Markup/GetAllMarkups`).pipe(map(result => result))
  }

  addMarkup(Markup: Markup): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Markup/AddMarkup`, Markup, this.apiService.httpOptions)
  }

  deleteMarkup(MarkupId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}Markup/DeleteMarkup` + "/" + MarkupId, this.apiService.httpOptions)
  }

  editMarkup(MarkupId: number, Markup: Markup): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Markup/UpdateMarkup/${MarkupId}`, Markup, this.apiService.httpOptions)
  }
}
