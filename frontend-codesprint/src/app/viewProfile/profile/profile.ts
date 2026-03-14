import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ProfileService } from '../services/profile.services';
import { SeniorProfile } from '../models/senior-profile.model';

import {
  heroPencilSquare,
  heroUser,
  heroPhone,
  heroEnvelope,
  heroMapPin,
  heroShieldCheck,
  heroInformationCircle,
  heroDocumentText,
  heroHeart,
  heroStar,
  heroUsers,
  heroPhoto
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, NgIconComponent],
  viewProviders: [
    provideIcons({
      heroPencilSquare,
      heroUser,
      heroPhone,
      heroEnvelope,
      heroMapPin,
      heroShieldCheck,
      heroInformationCircle,
      heroDocumentText,
      heroHeart,
      heroStar,
      heroUsers,
      heroPhoto
    }),
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private router = inject(Router);
  private profileService = inject(ProfileService);

  profileData: SeniorProfile | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;

    this.profileService.getProfile().subscribe({
      next: (profile: SeniorProfile) => {
        this.profileData = profile;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando perfil:', error);
        this.isLoading = false;
      },
    });
  }

  navigateToEdit(): void {
    this.router.navigate(['/profile-edit']);
  }

  viewProvider(id: number): void {
    this.router.navigate(['/proveedor', id]);
  }

  getYearsInPlatform(): number {
    if (!this.profileData?.memberSince) return 0;

    const startYear = new Date(this.profileData.memberSince).getFullYear();
    return new Date().getFullYear() - startYear;
  }

  hasProfileImage(): boolean {
    return !!this.profileData?.profileImage;
  }
}
