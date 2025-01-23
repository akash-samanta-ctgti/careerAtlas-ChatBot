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
    HttpClientModule,
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  chatMessage: string = '';
  chatHistory: { user: string; bot: string }[] = [];
  private loadingInterval: any;

  constructor(private http: HttpClient) { }

  sendMessage() {
    if (this.chatMessage.trim()) {
      const messageIndex = this.chatHistory.length;
      this.chatHistory.push({ user: this.chatMessage, bot: 'loading' });

      this.startLoadingAnimation(messageIndex);
      this.http
        .post<{ response: string }>('https://my-api.com/chat', {
          message: this.chatMessage,
        })
        .pipe(
          catchError((error) => {
            this.stopLoadingAnimation();
            console.error('Error occurred:', error);
            this.chatHistory[this.chatHistory.length - 1].bot =
              'Sorry, something went wrong. Please try again later.';
            return of({ response: 'demo response' });
          })
        )
        .subscribe((response) => {
          this.stopLoadingAnimation();
          this.chatHistory[this.chatHistory.length - 1].bot = response.response;
        });

      this.chatMessage = '';
    }
  }

  startLoadingAnimation(index: number) {
    let dots = '';
    this.loadingInterval = setInterval(() => {
      dots = dots.length >= 3 ? '' : dots + '.';
      this.chatHistory[index].bot = `loading${dots}`;
    }, 200);
  }

  stopLoadingAnimation() {
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
    }
  }
}
