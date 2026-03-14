import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../services/profile.services';
import { SeniorProfile } from '../models/senior-profile.model';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import {
  heroArrowLeft,
  heroPhoto,
  heroExclamationTriangle,
  heroCheckCircle,
  heroChevronDown,
  heroChevronUp
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  viewProviders: [
    provideIcons({
      heroArrowLeft,
      heroPhoto,
      heroExclamationTriangle,
      heroCheckCircle,
      heroChevronDown,
      heroChevronUp
    }),
  ],
  templateUrl: './profile-edit.html',
  styleUrl: './profile-edit.css',
})
export class ProfileEdit implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private profileService = inject(ProfileService);

  profileForm!: FormGroup;
  originalProfile!: SeniorProfile;

  imagePreview: string | null = null;
  selectedFileError = '';

  statusMessage: { text: string; type: 'success' | 'error' | null } = {
    text: '',
    type: null,
  };

  isSubmitting = false;
  isPasswordSectionOpen = false;

  ngOnInit(): void {
    this.buildForm();
    this.loadProfile();
  }

  private buildForm(): void {
    this.profileForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        age: [null, [Validators.required, Validators.min(1), Validators.max(120)]],
        gender: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{4}-[0-9]{4}$/)]],
        address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],

        familyMember: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        relation: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],

        emergencyName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        emergencyRelation: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        emergencyPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{4}-[0-9]{4}$/)]],

        mobility: ['', [Validators.maxLength(300)]],
        medical: ['', [Validators.maxLength(300)]],
        allergies: ['', [Validators.maxLength(300)]],

        currentPassword: [''],
        newPassword: ['', [this.passwordStrengthValidator()]],
        confirmPassword: [''],
      },
      {
        validators: [this.passwordMatchValidator()],
      }
    );
  }

  private loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile: SeniorProfile) => {
        this.originalProfile = profile;
        this.imagePreview = profile.profileImage || null;

        this.profileForm.patchValue({
          fullName: profile.fullName,
          age: profile.age,
          gender: profile.gender,
          phone: profile.phone,
          address: profile.address,

          familyMember: profile.familyMember,
          relation: profile.relation,
          email: profile.email,

          emergencyName: profile.emergencyName,
          emergencyRelation: profile.emergencyRelation,
          emergencyPhone: profile.emergencyPhone,

          mobility: profile.mobility || '',
          medical: profile.medical || '',
          allergies: profile.allergies || '',

          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      },
      error: (error) => {
        console.error('Error cargando perfil:', error);
        this.showStatus('No se pudo cargar el perfil.', 'error');
      },
    });
  }

  togglePasswordSection(): void {
    this.isPasswordSectionOpen = !this.isPasswordSectionOpen;

    if (!this.isPasswordSectionOpen) {
      this.clearPasswordFields();
    }
  }

  private clearPasswordFields(): void {
    this.profileForm.patchValue({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    this.profileForm.get('currentPassword')?.markAsPristine();
    this.profileForm.get('currentPassword')?.markAsUntouched();

    this.profileForm.get('newPassword')?.markAsPristine();
    this.profileForm.get('newPassword')?.markAsUntouched();

    this.profileForm.get('confirmPassword')?.markAsPristine();
    this.profileForm.get('confirmPassword')?.markAsUntouched();

    this.profileForm.updateValueAndValidity();
  }

  get wantsToChangePassword(): boolean {
    const currentPassword = this.profileForm.get('currentPassword')?.value?.trim();
    const newPassword = this.profileForm.get('newPassword')?.value?.trim();
    const confirmPassword = this.profileForm.get('confirmPassword')?.value?.trim();

    return !!currentPassword || !!newPassword || !!confirmPassword;
  }

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.selectedFileError = '';

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

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
    this.statusMessage = { text: '', type: null };

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.showStatus('Por favor corrige los errores del formulario.', 'error');
      return;
    }

    const currentPassword = this.profileForm.get('currentPassword')?.value?.trim();
    const newPassword = this.profileForm.get('newPassword')?.value?.trim();
    const confirmPassword = this.profileForm.get('confirmPassword')?.value?.trim();

    const wantsPasswordChange = !!currentPassword || !!newPassword || !!confirmPassword;

    if (wantsPasswordChange) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        this.showStatus('Para cambiar la contraseña debes completar los 3 campos.', 'error');
        return;
      }

      if (newPassword !== confirmPassword) {
        this.showStatus('La nueva contraseña y su confirmación no coinciden.', 'error');
        return;
      }

      if (this.profileForm.get('newPassword')?.invalid) {
        this.showStatus('La nueva contraseña no cumple los requisitos de seguridad.', 'error');
        return;
      }
    }

    this.isSubmitting = true;

    const formValue = this.profileForm.value;

    const updatedProfile: SeniorProfile = {
      ...this.originalProfile,
      fullName: formValue.fullName.trim(),
      age: Number(formValue.age),
      gender: formValue.gender,
      phone: formValue.phone.trim(),
      address: formValue.address.trim(),

      familyMember: formValue.familyMember.trim(),
      relation: formValue.relation.trim(),
      email: formValue.email.trim(),

      emergencyName: formValue.emergencyName.trim(),
      emergencyRelation: formValue.emergencyRelation.trim(),
      emergencyPhone: formValue.emergencyPhone.trim(),

      mobility: formValue.mobility?.trim() || '',
      medical: formValue.medical?.trim() || '',
      allergies: formValue.allergies?.trim() || '',

      profileImage: this.imagePreview,
    };

    this.profileService.updateProfile(updatedProfile).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showStatus('Perfil actualizado correctamente.', 'success');

        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 900);
      },
      error: (error) => {
        console.error('Error guardando perfil:', error);
        this.isSubmitting = false;
        this.showStatus('Ocurrió un error al guardar los cambios.', 'error');
      },
    });
  }

  handleCancel(): void {
    this.profileForm.reset();
    this.loadProfile();
    this.statusMessage = { text: '', type: null };
    this.router.navigate(['/profile']);
  }

  private showStatus(text: string, type: 'success' | 'error'): void {
    this.statusMessage = { text, type };
  }

  private passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) return null;

      const hasMinLength = value.length >= 8;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`]/.test(value);

      const isValid =
        hasMinLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar;

      return isValid ? null : { weakPassword: true };
    };
  }

  private passwordMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const newPassword = group.get('newPassword')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;

      if (!confirmPassword) return null;

      return newPassword === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);

    if (!field || !field.touched || !field.errors) return '';

    if (field.errors['required']) return 'Este campo es obligatorio.';
    if (field.errors['email']) return 'Ingresa un correo electrónico válido.';
    if (field.errors['minlength']) {
      return `Debe tener al menos ${field.errors['minlength'].requiredLength} caracteres.`;
    }
    if (field.errors['maxlength']) {
      return `No debe superar ${field.errors['maxlength'].requiredLength} caracteres.`;
    }
    if (field.errors['min']) {
      return `El valor mínimo permitido es ${field.errors['min'].min}.`;
    }
    if (field.errors['max']) {
      return `El valor máximo permitido es ${field.errors['max'].max}.`;
    }
    if (field.errors['pattern']) {
      if (fieldName === 'phone' || fieldName === 'emergencyPhone') {
        return 'Usa el formato 8888-7777.';
      }
      return 'Formato inválido.';
    }
    if (field.errors['weakPassword']) {
      return 'Debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.';
    }

    return 'Campo inválido.';
  }

  get hasPasswordMismatch(): boolean {
    return (
      this.profileForm.hasError('passwordMismatch') &&
      this.profileForm.get('confirmPassword')?.touched === true
    );
  }
}
