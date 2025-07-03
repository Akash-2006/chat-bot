import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {ChatHistoryService} from '../chat-history/chat-history.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-chat-threads',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './chat-threads.component.html',
  styleUrl: './chat-threads.component.css'
})
export class ChatThreadsComponent {
  constructor(
    private readonly ChatHistoryService: ChatHistoryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadTheme();
  }

  renamingChatId: string | null = null;
  newChatName?: string;
  isDarkMode = false;
  openDetailsId: string | null = null;

   createNewChat() {
     this.ChatHistoryService.createChat();
    console.log(this.ChatHistoryService.getChats());
  }

  getAllChats(){
    return Object.keys(this.ChatHistoryService.getChats()??{});
  }

  changeChat(chatName:string){
    console.log("hii");
    this.ChatHistoryService.changeChat(chatName);
  }

  downloadChatHistory(event: Event) {
    event.stopPropagation();
    const dataStr = JSON.stringify(this.ChatHistoryService.getHistory(), null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-history.json';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  enableRename(event: Event, chatId: string){
    event.stopPropagation();
    this.renamingChatId = chatId;
    this.newChatName = chatId; // Pre-fill with current name

    // Close the details element
    const target = event.target as HTMLElement;
    const details = target.closest('details');
    if (details) {
      details.open = false;
    }

    // Focus the input field after Angular renders it
    setTimeout(() => {
      const inputElement = document.querySelector('.rename-input') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
        inputElement.select(); // Also select all text for easy replacement
      }
    }, 0);
  }

  cancelRename() {
    this.renamingChatId = null;
    this.newChatName = undefined;
  }

  renameChat(chat:string) {
    if (this.newChatName && this.newChatName.trim()) {
      const newName = this.newChatName.trim();
      const wasActiveChat = this.ChatHistoryService.fetchCurrentChat() === chat;

      this.ChatHistoryService.rename(chat, newName);

      // If this was the active chat, switch to the renamed chat to keep it active
      if (wasActiveChat) {
        this.ChatHistoryService.changeChat(newName);
      }
    }
    this.renamingChatId = null;
    this.newChatName = undefined;
  }

  isRenaming(chatId: string): boolean {
    return this.renamingChatId === chatId;
  }

  onDetailsToggle(event: Event, chatId: string) {
    const detailsElement = event.target as HTMLDetailsElement;

    if (detailsElement.open) {
      // If this details is being opened, close all others
      this.closeAllDetailsExcept(chatId);
      this.openDetailsId = chatId;
    } else {
      // If this details is being closed
      this.openDetailsId = null;
    }
  }

  private closeAllDetailsExcept(exceptChatId: string) {
    // Close all other details elements
    const allDetails = document.querySelectorAll('.chat-options');
    allDetails.forEach((details: Element) => {
      const detailsElement = details as HTMLDetailsElement;
      const container = details.closest('.chat-thread-container');
      const chatName = container?.querySelector('.chat-name')?.textContent?.trim();

      if (chatName && chatName !== exceptChatId) {
        detailsElement.open = false;
      }
    });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    this.saveTheme();
  }

  private loadTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme === 'dark';
      this.applyTheme();
    }
  }

  private applyTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;
      if (this.isDarkMode) {
        htmlElement.setAttribute('data-theme', 'dark');
      } else {
        htmlElement.removeAttribute('data-theme');
      }
    }
  }

  private saveTheme() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
  }
}
