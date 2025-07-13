import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class TokenStorage {
  clear() {
    localStorage.removeItem('accessToken');
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }
}