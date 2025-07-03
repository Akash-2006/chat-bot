import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { ChatHistoryService } from "../chat-history/chat-history.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-chat-threads",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./chat-threads.component.html",
  styleUrl: "./chat-threads.component.css",
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
  }

  getAllChats() {
    return Object.keys(this.ChatHistoryService.getChats() ?? {});
  }

  changeChat(chatName: string) {
    this.ChatHistoryService.changeChat(chatName);
  }

  downloadChatHistory(event: Event) {
    event.stopPropagation();
    const dataStr = JSON.stringify(
      this.ChatHistoryService.getHistory(),
      null,
      2
    );
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "chat-history.json";
    a.click();

    window.URL.revokeObjectURL(url);
  }

  enableRename(event: Event, chatId: string) {
    event.stopPropagation();
    this.renamingChatId = chatId;
    this.newChatName = chatId;

    const target = event.target as HTMLElement;
    const details = target.closest("details");
    if (details) {
      details.open = false;
    }
    setTimeout(() => {
      const inputElement = document.querySelector(
        ".rename-input"
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
        inputElement.select();
      }
    }, 0);
  }

  cancelRename() {
    this.renamingChatId = null;
    this.newChatName = undefined;
  }

  renameChat(chat: string) {
    if (this.newChatName && this.newChatName.trim()) {
      const newName = this.newChatName.trim();
      const wasActiveChat = this.ChatHistoryService.fetchCurrentChat() === chat;

      this.ChatHistoryService.rename(chat, newName);

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
      this.closeAllDetailsExcept(chatId);
      this.openDetailsId = chatId;
      this.addFocusBlurListeners(detailsElement);
    } else {
      this.openDetailsId = null;
      this.removeFocusBlurListeners(detailsElement);
    }
  }

  private addFocusBlurListeners(detailsElement: HTMLDetailsElement) {
    const handleFocusOut = (event: FocusEvent) => {
      setTimeout(() => {
        const activeElement = document.activeElement;
        const isWithinDetails = detailsElement.contains(activeElement);
        if (!isWithinDetails && detailsElement.open) {
          detailsElement.open = false;
          this.openDetailsId = null;
          this.removeFocusBlurListeners(detailsElement);
        }
      }, 0);
    };
    (detailsElement as any)._focusOutHandler = handleFocusOut;
    detailsElement.addEventListener("focusout", handleFocusOut);
  }

  private removeFocusBlurListeners(detailsElement: HTMLDetailsElement) {
    const handler = (detailsElement as any)._focusOutHandler;
    if (handler) {
      detailsElement.removeEventListener("focusout", handler);
      delete (detailsElement as any)._focusOutHandler;
    }
  }

  private closeAllDetailsExcept(exceptChatId: string) {
    const allDetails = document.querySelectorAll(".chat-options");
    allDetails.forEach((details: Element) => {
      const detailsElement = details as HTMLDetailsElement;
      const container = details.closest(".chat-thread-container");
      const chatName = container
        ?.querySelector(".chat-name")
        ?.textContent?.trim();

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
      const savedTheme = localStorage.getItem("theme");
      this.isDarkMode = savedTheme === "dark";
      this.applyTheme();
    }
  }

  private applyTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;
      if (this.isDarkMode) {
        htmlElement.setAttribute("data-theme", "dark");
      } else {
        htmlElement.removeAttribute("data-theme");
      }
    }
  }

  private saveTheme() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("theme", this.isDarkMode ? "dark" : "light");
    }
  }
}
