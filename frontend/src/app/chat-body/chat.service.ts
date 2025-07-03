import {Injectable,inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ResponseType} from './response.type';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ChatService {
  httpUrl = 'http://localhost:8000/chat'
  private readonly http:HttpClient = inject(HttpClient)

   postMessage(message: string):Observable<ResponseType> {
    console.log('Posting message:', message);

      return this.http.post<ResponseType>(this.httpUrl, {message: message});
   }
}
