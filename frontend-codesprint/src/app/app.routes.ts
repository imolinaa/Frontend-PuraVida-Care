import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { ProfileEdit } from './viewProfile/profile-edit/profile-edit';
import { Profile } from './viewProfile/profile/profile';
import { HomeComponent } from './client/home-client/home-client';
import { FamilyProfileComponent } from './viewProfile/family-profile/family-profile';
import { ProviderProfileComponent } from './viewProfile/provider-profile/provider-profile';
import { FamilyProfileEdit } from './viewProfile/family-profile-edit/family-profile-edit';
import { ProviderProfileEditComponent } from './viewProfile/provider-profile-edit/provider-profile-edit';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },

  {
    path: 'landing',
    component: Landing
  },

  {
    path: 'home',
    component: HomeComponent
  },

  {
    path: 'profile',
    component: Profile
  },

  {
    path: 'profile-edit',
    component: ProfileEdit
  },

  {
    path: 'family-profile',
    component: FamilyProfileComponent 
  },

  {
    path: 'family-profile-edit',
    component: FamilyProfileEdit
  },

  {
    path: 'provider-profile',
    component: ProviderProfileComponent
  },

  {
    path: 'provider-profile-edit',
    component: ProviderProfileEditComponent
  }

];
