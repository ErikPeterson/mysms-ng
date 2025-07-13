import { Component, inject } from '@angular/core';
import { Auth } from '../auth';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  private auth = inject(Auth);

  email = new FormControl("");
  password = new FormControl("");
  error: string = "";

  onSubmit(event: any){
    event.preventDefault();
    this.auth.login(
      {
         email: this.email.value, 
         password: this.password.value 
       }
    ).subscribe();
  }
}
