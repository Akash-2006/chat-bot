import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ChatBodyComponent} from './chat-body/chat-body.component';
import {ChatThreadsComponent} from './chat-body/chat-threads/chat-threads.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatBodyComponent, ChatThreadsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chatBot';
}
