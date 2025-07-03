import { Component, inject } from '@angular/core';
import { ChatHistoryService } from './chat-history.service';
import {MarkdownComponent} from 'ngx-markdown';

@Component({
  selector: 'app-chat-history',
  standalone: true,
  imports: [MarkdownComponent],
  templateUrl: './chat-history.component.html',
  styleUrl: './chat-history.component.css'
})
export class ChatHistoryComponent {
  private readonly chatHistory = inject(ChatHistoryService);
  readonly history = this.chatHistory.getHistory;
}
