import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'auth-success', component: AuthCallbackComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
