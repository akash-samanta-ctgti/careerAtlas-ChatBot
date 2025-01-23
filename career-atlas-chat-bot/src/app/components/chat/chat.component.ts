import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  chatMessage: string = '';
  chatHistory: { user: string; bot: string }[] = [];

  constructor(private http: HttpClient) { }

  sendMessage() {
    if (this.chatMessage.trim()) {
      this.chatHistory.push({ user: this.chatMessage, bot: '' });

      this.http
        .post<{ response: string }>('https://api.example.com/chat', {
          message: this.chatMessage,
        })
        .pipe(
          catchError((error) => {
            console.error('Error occurred:', error);  
            this.chatHistory[this.chatHistory.length - 1].bot = 'Sorry, something went wrong. Please try again later.';  
            return of({ response: 'demo response' });  
          })
        )
        .subscribe((response) => {
          this.chatHistory[this.chatHistory.length - 1].bot = response.response;
        });
      this.chatMessage = '';
    }
  }

}
