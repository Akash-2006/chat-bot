import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ResponseType } from "./response.type";
import { Observable } from "rxjs";
import { timeout, catchError, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class ChatService {
  httpUrl = "https://chat-bot-dgnf.onrender.com/chat";
  private readonly http: HttpClient = inject(HttpClient);

  postMessage(message: string): Observable<ResponseType> {
    return this.http.post<ResponseType>(this.httpUrl, { message: message }).pipe(
      timeout(60000),
      catchError(error => {
        console.error('Chat service error:', error);
        return of({ reply: 'Sorry, the request timed out or failed. Please try again.' });
      })
    );
  }
}
