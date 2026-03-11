import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { ProfileEdit } from './profile-edit/profile-edit';
import { Profile } from './profile/profile';


export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'profile', component: Profile },
  { path: 'profile-edit', component: ProfileEdit }
];
