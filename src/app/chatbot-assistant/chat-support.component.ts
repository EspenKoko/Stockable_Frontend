import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from '../services/chatbot.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Message } from '../viewModels/chatbotMessages';

@Component({
  selector: 'app-chat-support',
  templateUrl: './chat-support.component.html',
  styleUrls: ['./chat-support.component.scss'],
})
export class ChatSupportComponent {
  isOpen = false;
  loading = false;
  messages: Message[] = [];
  chatForm = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });
  @ViewChild('scrollMe') private myScrollContainer: any;

  constructor(private messageService: MessageService) {
  }

  openSupportPopup() {
    this.isOpen = !this.isOpen;
  }

  auditInteration(message: any) {
    this.messageService.addChatBotInteraction(message).subscribe({
      next: (value: any) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200){}
        else console.error(response);
      }
    })
  }

  sendMessage() {
    const sentMessage = this.chatForm.value.message!;
    this.loading = true;
    this.messages.push({
      type: 'user',
      message: sentMessage,
      date: new Date()
    });

    this.auditInteration(this.messages[this.messages.length - 1])

    this.chatForm.reset();
    this.scrollToBottom();
    this.messageService.sendMessage(sentMessage).subscribe((response: any) => {
      for (const obj of response) {
        let value
        if (obj.hasOwnProperty('text')) {
          value = obj['text']
          this.pushMessage(value)

        }
        if (obj.hasOwnProperty('image')) {
          value = obj['image']
          this.pushMessage(value)
        }
      }
    });
  }

  pushMessage(message: string) {
    this.messages.push({
      type: 'client',
      message: message,
      date: new Date()
    });
    this.auditInteration(this.messages[this.messages.length - 1])
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.myScrollContainer.nativeElement.scrollTop =
          this.myScrollContainer.nativeElement.scrollHeight + 500;
      } catch (err) { }
    }, 150);
  }
}
