import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.services';
import { FamilyProfile } from '../models/family-profile.model';

@Component({
  selector: 'app-family-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './family-profile-edit.html',
  styleUrl: './family-profile-edit.css',
})
export class FamilyProfileEdit implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private profileService = inject(ProfileService);

  profileForm!: FormGroup;
  originalProfile!: FamilyProfile;
  imagePreview: string | null = null;
  selectedFileError = '';
  isSubmitting = false;

  ngOnInit(): void {
    this.buildForm();
    this.loadProfile();
  }

  private buildForm(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{4}-[0-9]{4}$/)]],
      relationToSenior: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],

      emergencyName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      emergencyRelation: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      emergencyPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{4}-[0-9]{4}$/)]],

      importantNotes: ['', [Validators.maxLength(300)]],
    });
  }

  private loadProfile(): void {
    this.profileService.getFamilyProfile().subscribe((profile) => {
      this.originalProfile = profile;
      this.imagePreview = profile.profileImage || null;

      this.profileForm.patchValue({
        fullName: profile.fullName,
        phone: profile.phone,
        relationToSenior: profile.relationToSenior,
        emergencyName: profile.emergencyName,
        emergencyRelation: profile.emergencyRelation,
        emergencyPhone: profile.emergencyPhone,
        importantNotes: profile.importantNotes,
      });
    });
  }

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.selectedFileError = '';

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      this.selectedFileError = 'Solo se permiten imágenes JPG, PNG o WEBP.';
      input.value = '';
      return;
    }

    if (file.size > maxSize) {
      this.selectedFileError = 'La imagen no puede superar los 5MB.';
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.imagePreview = null;
    this.selectedFileError = '';
  }

  handleSave(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.profileForm.value;

    const updatedProfile: FamilyProfile = {
      ...this.originalProfile,
      fullName: formValue.fullName.trim(),
      phone: formValue.phone.trim(),
      relationToSenior: formValue.relationToSenior.trim(),
      emergencyName: formValue.emergencyName.trim(),
      emergencyRelation: formValue.emergencyRelation.trim(),
      emergencyPhone: formValue.emergencyPhone.trim(),
      importantNotes: formValue.importantNotes?.trim() || '',
      profileImage: this.imagePreview,
    };

    this.profileService.updateFamilyProfile(updatedProfile).subscribe(() => {
      this.isSubmitting = false;
      this.router.navigate(['/family-profile']);
    });
  }

  handleCancel(): void {
    this.router.navigate(['/family-profile']);
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);

    if (!field || !field.touched || !field.errors) return '';

    if (field.errors['required']) return 'Este campo es obligatorio.';
    if (field.errors['minlength']) return `Debe tener al menos ${field.errors['minlength'].requiredLength} caracteres.`;
    if (field.errors['maxlength']) return `No debe superar ${field.errors['maxlength'].requiredLength} caracteres.`;
    if (field.errors['pattern']) return 'Usa el formato 8888-7777.';

    return 'Campo inválido.';
  }
}
