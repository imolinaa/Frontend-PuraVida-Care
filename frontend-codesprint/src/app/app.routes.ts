import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { ProfileEdit } from './profile-edit/profile-edit';
import { Profile } from './profile/profile';
import { HomeComponent } from './client/home-client/home-client';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    component: HomeComponent
  },

  {
    path: 'landing',
    component: Landing
  },

  {
    path: 'profile',
    component: Profile
  },

  {
    path: 'profile-edit',
    component: ProfileEdit
  }

];
