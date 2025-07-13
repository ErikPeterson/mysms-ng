import { HttpClient, HttpResponse, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxAuthService } from 'ngx-auth';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { TokenStorage } from './token-storage';

import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class Auth implements NgxAuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenStorage = inject(TokenStorage);

  getAccessToken() {
    const token = this.tokenStorage.getAccessToken();

    return of(token);
  }

  isAuthenticated() {
    return this.getAccessToken().pipe(map(token => !!token));
  }

  login(credentials: any) {
    return this.http.post<Observable<HttpResponse<Object>>>(
            `${environment['apiUrl']}/auth/sign_in`, 
            credentials, 
            { 
              headers: { 'Content-Type': 'application/json' },
              observe: 'response'
            }
      ).pipe(
        tap(async (response: any) => {
          let headers: any = response.headers;

          this.saveTokenFromHeaders(headers);
          
          await this.router.navigateByUrl('/');
        }),
        catchError((err) => {
          return throwError(() => err
        );
        })
      );
  }

  private saveAccessData(accessToken: string) {
    this.tokenStorage.setAccessToken(accessToken);
  }

  refreshShouldHappen(response: HttpErrorResponse) {
    return response.status === 401;
  }

  skipRequest(req: HttpRequest<any>) {
    return req.url.endsWith('/refresh');
  }

  saveTokenFromHeaders(headers: any){
    let token: string = btoa(JSON.stringify(
            {
              "access-token": headers.get("access-token"),
              "token-type": "Bearer",
              "client": headers.get("client"),
              "expiry": headers.get("expiry"),
              "uid": headers.get("uid")
            }
          ));
    
    this.saveAccessData(token);
  }

  refreshToken() {
    const refreshToken = this.tokenStorage.getAccessToken();

    return this.http.post<any>(`${environment['apiUrl']}/auth/refresh`, { refreshToken }).pipe(
      tap(async (response: any) => {
          let token: string = response.headers['Authorization'] ?? '';
          this.saveAccessData(token);
          await this.router.navigateByUrl('/');
      }),
      catchError(async (err) => {
        await this.logout();

        return throwError(() => err);
      }),
    );
  }

  async logout() {
    this.tokenStorage.clear();
    await this.router.navigateByUrl('/');
    location.reload();

  }
}