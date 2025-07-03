import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ChatService } from "./chat.service";
import { Observable } from "rxjs";
import { ResponseType } from "./response.type";
import { MarkdownComponent } from "ngx-markdown";
import { DomSanitizer } from "@angular/platform-browser";
import { ChatHistoryComponent } from "./chat-history/chat-history.component";
import { ChatHistoryService } from "./chat-history/chat-history.service";

@Component({
  selector: "app-chat-body",
  standalone: true,
  imports: [FormsModule, MarkdownComponent, ChatHistoryComponent],
  templateUrl: "./chat-body.component.html",
  styleUrls: ["./chat-body.component.css"],
})
export class ChatBodyComponent {
  protected userInput?: string;
  protected responseData?: string;
  protected isLoading: boolean = false;
  private readonly sanitizer = inject(DomSanitizer);
  private readonly chatHistory: ChatHistoryService = inject(ChatHistoryService);
  constructor(private readonly chatService: ChatService) {}
  sendMessage() {
    if (!this.userInput?.trim() || this.isLoading) {
      return;
    }

    // Store the message before clearing input
    const messageToSend = this.userInput.trim();

    // Add user message to history immediately
    this.addUserMessageToHistory(messageToSend);

    // Clear input immediately and set loading state
    this.userInput = "";
    this.isLoading = true;
    console.log('Setting isLoading to true');

    const response: Observable<ResponseType> =
      this.chatService.postMessage(messageToSend);
    response.subscribe({
      next: (data) => {
        console.log('Received response, setting isLoading to false');
        this.responseData = data.reply;
        this.addBotResponseToHistory(data.reply);
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error getting response:", error);
        console.log('Error occurred, setting isLoading to false');
        this.addBotResponseToHistory(
          "Sorry, I encountered an error. Please try again."
        );
        this.isLoading = false;
      },
    });
  }
  get formattedReply() {
    return (
      this.responseData ??
      ""
        .replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold text
        .replace(/\n/g, "<br/>")
    );
  }

  addToHistory(userMessage: string, botResponse: string) {
    if (userMessage.trim() && botResponse) {
      this.chatHistory.addMessage(userMessage, botResponse);
    }
  }

  addUserMessageToHistory(userMessage: string) {
    if (userMessage.trim()) {
      this.chatHistory.addUserMessage(userMessage);
    }
  }

  addBotResponseToHistory(botResponse: string) {
    if (botResponse) {
      this.chatHistory.addBotResponse(botResponse);
    }
  }

  onEnterPress(event: Event) {
    const currentEvent: KeyboardEvent = event as KeyboardEvent;
    // Prevent default behavior (new line) and send message
    if (!currentEvent.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
    // Allow Shift+Enter for new lines if needed
  }

  isAnyChatActive(): boolean {
    return this.chatHistory.isChatActive();
  }
}
