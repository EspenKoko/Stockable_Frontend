import { Component } from '@angular/core';
import { MessageService } from '../services/chatbot.service';
import { Message } from '../viewModels/chatbotMessages';

@Component({
  selector: 'app-chat-assistant-records',
  templateUrl: './chat-assistant-records.component.html',
  styleUrls: ['./chat-assistant-records.component.scss']
})
export class ChatAssistantRecordsComponent {
  messages: Message[] = [];

  constructor(private messageService: MessageService) {
    this.getMessages();
  }

  getMessages() {
    this.messageService.getChatBotInteractions().subscribe((result: any[]) => {
      this.messages = result;
    })
  }

}
