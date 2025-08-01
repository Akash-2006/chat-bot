import { computed, Injectable, Signal, signal } from "@angular/core";
import { BodyType, ChatHistoryType } from "./chat-history.type";

@Injectable({ providedIn: "root" })
export class ChatHistoryService {
  private readonly chatHistory = signal<ChatHistoryType | null>(null);
  private readonly activeChat = signal(
    Object.keys(this.chatHistory() ?? {})[0]
  );
  readonly getHistory: Signal<BodyType[]> = computed(
    () => this.chatHistory()?.[this.activeChat()] ?? []
  );
  constructor() {
    const perviousHistory = localStorage.getItem("history");
    const perviousActiveChat = localStorage.getItem("activeChat");
    if (perviousHistory) {
      this.chatHistory.set(JSON.parse(perviousHistory));
    }
    if (perviousActiveChat) {
      this.activeChat.set(perviousActiveChat);
    }
  }

  saveHistory(): void {
    localStorage.setItem("history", JSON.stringify(this.chatHistory()));
    localStorage.setItem("activeChat", this.activeChat());
  }
  addMessage(request: string, response: string): void {
    this.chatHistory.set({
      ...(this.chatHistory() ?? {}),
      [this.activeChat()]: [
        ...(this.chatHistory()?.[this.activeChat()] ?? []),
        { request, response },
      ],
    });
    this.saveHistory();
  }

  addUserMessage(request: string): void {
    this.chatHistory.set({
      ...(this.chatHistory() ?? {}),
      [this.activeChat()]: [
        ...(this.chatHistory()?.[this.activeChat()] ?? []),
        { request, response: "" },
      ],
    });
    this.saveHistory();
  }

  addBotResponse(response: string): void {
    const currentHistory = this.chatHistory();
    const currentChatHistory = currentHistory?.[this.activeChat()] ?? [];

    if (currentChatHistory.length > 0) {
      const lastIndex = currentChatHistory.length - 1;
      const updatedHistory = [...currentChatHistory];
      updatedHistory[lastIndex] = {
        ...updatedHistory[lastIndex],
        response,
      };

      this.chatHistory.set({
        ...(currentHistory ?? {}),
        [this.activeChat()]: updatedHistory,
      });
      this.saveHistory();
    }
  }

  createChat() {
    const length = Object.keys(this.chatHistory() ?? {}).length;
    this.chatHistory.set({ ...this.chatHistory(), ["untitled" + length]: [] });
    this.activeChat.set("untitled" + length);
    this.saveHistory();
  }

  fetchCurrentChat() {
    return this.activeChat();
  }

  getChats() {
    return this.chatHistory();
  }

  changeChat(chatName: string) {
    this.activeChat.set(chatName);
    this.saveHistory();
  }

  isChatActive(): boolean {
    return (
      this.activeChat() !== null &&
      this.activeChat() !== undefined &&
      this.activeChat() !== ""
    );
  }

  rename(oldKey: string, newKey: string) {
    const current = this.chatHistory();

    if (!current?.[oldKey]) return;

    const { [oldKey]: oldData, ...rest } = current;

    const updated = {
      ...rest,
      [newKey]: oldData,
    };

    this.chatHistory.set(updated);
    this.saveHistory();
  }

  deleteChat(chatName: string) {
    const current = this.chatHistory();

    if (!current?.[chatName]) return;

    const { [chatName]: deletedChat, ...rest } = current;

    // If we're deleting the active chat, switch to another one
    if (this.activeChat() === chatName) {
      const remainingChats = Object.keys(rest);
      if (remainingChats.length >= 0) {
        this.activeChat.set(remainingChats[0]);
      } else {
        // If no chats remain, create a new one
        this.createChat();
        return;
      }
    }

    this.chatHistory.set(rest);
    this.saveHistory();
  }
}
