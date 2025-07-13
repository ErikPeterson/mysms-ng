import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { type ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ngxAuthInterceptor, provideNgxAuthProviders } from 'ngx-auth';

import { routes } from './app.routes';
import { Auth } from './auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        ngxAuthInterceptor,
      ]),
    ),
    provideRouter(routes),
    provideNgxAuthProviders({
      authService: Auth,
      protectedRedirectUri: '/',
      publicRedirectUri: '/login',
    }),
  ],
};