import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ChatBotInteraction } from '../models/chatBotInteractions';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) { }

  sendMessage(message: string) {
    return this.httpClient.post('http://localhost:5005/webhooks/rest/webhook', { message: message });
  }

  getChatBotInteraction(ChatBotInteractionId: number) {
    return this.httpClient.get(`${this.apiUrl}ChatBotInteraction/GetChatBotInteraction` + "/" + ChatBotInteractionId)
      .pipe(map(result => result))
  }

  getChatBotInteractions(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}ChatBotInteraction/GetAllChatBotInteraction`)
      .pipe(map(result => result))
  }

  addChatBotInteraction(ChatBotInteraction: ChatBotInteraction): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}ChatBotInteraction/AddChatBotInteraction`, ChatBotInteraction, this.apiService.httpOptions)
  }

  deleteChatBotInteraction(ChatBotInteractionId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}ChatBotInteraction/DeleteChatBotInteraction` + "/" + ChatBotInteractionId, this.apiService.httpOptions)
  }

  editChatBotInteraction(ChatBotInteractionId: number, ChatBotInteraction: ChatBotInteraction): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}ChatBotInteraction/UpdateChatBotInteraction/${ChatBotInteractionId}`, ChatBotInteraction, this.apiService.httpOptions)
  }
}
