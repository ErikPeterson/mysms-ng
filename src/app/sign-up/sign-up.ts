import { Component, inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Auth } from '../auth';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})

export class SignUp {
    private auth = inject(Auth);
    private http = inject(HttpClient);
    private router = inject(Router);
    email = new FormControl("");
    password = new FormControl("");
    password_confirmation = new FormControl("");
    error: string = "";

    onSubmit(event: any){
      event.preventDefault();
      return this.http.post<Observable<HttpResponse<Object>>>(
        `${API_URL}/auth`,
        {
          email: this.email.value,
          password: this.password.value,
          password_confirmation: this.password_confirmation.value
        }, 
        { 
          headers: { 'Content-Type': 'application/json' },
          observe: 'response'
        }
      ).pipe(
        tap(async (response: any) => {

            let headers: any = response.headers;
            this.auth.saveTokenFromHeaders(headers);

            await this.router.navigateByUrl('/')
        }),
        catchError((err) => {
          this.error = err.error.errors.full_messages.join(', ');
          return throwError(() => err);
        })
      ).subscribe();
}
}
