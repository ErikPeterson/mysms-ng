import { Routes } from '@angular/router';
import { ngxProtectedGuard, ngxPublicGuard } from 'ngx-auth';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
	{
		canActivate: [ngxPublicGuard],
		loadComponent: () =>  import('./login/login').then(m => m.Login),
		path: 'login'
	},
	{
		canActivate: [ngxPublicGuard],
		loadComponent: () => import('./sign-up/sign-up').then(m => m.SignUp),
		path: 'signup'
	},
	{
		canActivate: [ngxProtectedGuard],
		component: Dashboard,
		path: ''
	}
];
