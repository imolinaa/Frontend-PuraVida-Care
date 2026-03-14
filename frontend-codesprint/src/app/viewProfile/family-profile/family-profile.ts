import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../services/profile.services';
import { FamilyProfile } from '../models/family-profile.model';
import { NavbarComponent } from "../../components/navbar/navbar";

@Component({
  selector: 'app-family-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './family-profile.html',
  styleUrl: './family-profile.css',
})
export class FamilyProfileComponent implements OnInit {
  private profileService = inject(ProfileService);

  profile!: FamilyProfile;

  ngOnInit(): void {
    this.profileService.getFamilyProfile().subscribe((data) => {
      this.profile = data;
    });
  }
}
