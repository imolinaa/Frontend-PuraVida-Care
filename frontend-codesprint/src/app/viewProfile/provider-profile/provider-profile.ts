import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import { ProfileService } from '../services/profile.services';
import { ProviderProfile } from '../models/provider-profile.model';

import {
  heroArrowLeft,
  heroCheckBadge,
  heroMapPin,
  heroShieldCheck,
  heroPhone,
  heroEnvelope,
  heroClock,
  heroPencilSquare,
  heroStar,
  heroBriefcase,
  heroUserCircle
} from '@ng-icons/heroicons/outline';
import { NavbarComponent } from "../../components/navbar/navbar";

@Component({
  selector: 'app-provider-profile',
  standalone: true,
  imports: [CommonModule, NgIconComponent, NavbarComponent],
  viewProviders: [
    provideIcons({
      heroArrowLeft,
      heroCheckBadge,
      heroMapPin,
      heroShieldCheck,
      heroPhone,
      heroEnvelope,
      heroClock,
      heroPencilSquare,
      heroStar,
      heroBriefcase,
      heroUserCircle
    }),
  ],
  templateUrl: './provider-profile.html',
  styleUrls: ['./provider-profile.css'],
})
export class ProviderProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private profileService = inject(ProfileService);

  provider!: ProviderProfile;
  isLoading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '1';

    this.profileService.getProviderProfile(id).subscribe({
      next: (data) => {
        this.provider = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando proveedor:', error);
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/providers']);
  }

  editProviderProfile(): void {
    this.router.navigate(['/provider-profile-edit', this.provider.id]);
  }

  hireProvider(): void {
    this.router.navigate([`/seleccionar-servicio/${this.provider.id}`]);
  }

  getStarsArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => (i < Math.round(rating) ? 1 : 0));
  }

  hasProfileImage(): boolean {
    return !!this.provider?.profileImage;
  }
}
