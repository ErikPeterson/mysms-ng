import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../auth';
import { environment } from '../../environments/environment';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

const API_URL = environment.apiUrl;

interface Message {
  content: string;
  sid: string;
  phone_number: string;
  user: {
    email: string;
  };
  sent_at: string;
  snet: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard {
  protected data = signal<Message[]>([]);

  private auth = inject(Auth);
  private http = inject(HttpClient);

  disabled: boolean = false;

  phone = new FormControl("");
  messagetext = new FormControl("");
  messagelength: number = 0;
  buttontext: string = "Send";

  protected loadData(){
    this.http.get<{user: {messages?: Message[]}}>(`${API_URL}/users/me`, { 
      headers: { 'Accept': 'application/json'}
    }).subscribe((response) => {
      const messages: Message[] = response.user.messages?.sort((a, b) => {
        return new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime();
      }) || [];
      this.data.set(messages);
    })
  }

  protected ngOnInit(){
    this.loadData();

    this.messagetext.valueChanges.subscribe(name => {
      this.messagelength = name ? name.length : 0;
    });
  }

  send(event: any){
    event.preventDefault();
    this.disabled = true;
    this.buttontext = "Sending...";
    this.http.post(
      `${API_URL}/messages`,
      { 
        message: {
          content: this.messagetext.value,
          phone_number: this.phone.value
        }
      },
      { 
        headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json'
        }
      }
    ).subscribe((response: any) => {
      this.disabled = false;
      let message: any = response.message;
      if(message){
        this.data.update((values: any) => { return [message, ...values]})
      }
    })
  }
}
