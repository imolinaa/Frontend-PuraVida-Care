import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import { ProfileService } from '../services/profile.services';
import { ProviderProfile } from '../models/provider-profile.model';

import {
  heroArrowLeft,
  heroPhoto,
  heroCheckCircle,
  heroExclamationTriangle,
  heroPlus,
  heroTrash,
  heroBriefcase,
  heroMapPin,
  heroPhone,
  heroEnvelope,
  heroPencilSquare
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-provider-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  viewProviders: [
    provideIcons({
      heroArrowLeft,
      heroPhoto,
      heroCheckCircle,
      heroExclamationTriangle,
      heroPlus,
      heroTrash,
      heroBriefcase,
      heroMapPin,
      heroPhone,
      heroEnvelope,
      heroPencilSquare
    }),
  ],
  templateUrl: './provider-profile-edit.html',
  styleUrls: ['./provider-profile-edit.css'],
})
export class ProviderProfileEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private profileService = inject(ProfileService);

  providerId = '';
  providerData!: ProviderProfile;

  providerForm!: FormGroup;

  isLoading = true;
  isSubmitting = false;

  imagePreview: string | null = null;
  selectedFileError = '';

  statusMessage: { text: string; type: 'success' | 'error' | null } = {
    text: '',
    type: null
  };

  ngOnInit(): void {
    this.providerId = this.route.snapshot.paramMap.get('id') || '1';
    this.initForm();
    this.loadProvider();
  }

  initForm(): void {
    this.providerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(8)]],
      zone: ['', [Validators.required, Validators.minLength(3)]],
      bio: ['', [Validators.required, Validators.minLength(20)]],
      yearsExperience: [1, [Validators.required, Validators.min(0)]],
      insuranceActive: [false],
      profileImage: [''],
      services: this.fb.array([])
    });
  }

  loadProvider(): void {
    this.isLoading = true;

    this.profileService.getProviderProfile(this.providerId).subscribe({
      next: (provider) => {
        this.providerData = provider;
        this.imagePreview = provider.profileImage || null;

        this.providerForm.patchValue({
          fullName: provider.fullName,
          email: provider.email,
          phone: provider.phone,
          zone: provider.zone,
          bio: provider.bio,
          yearsExperience: provider.yearsExperience,
          insuranceActive: provider.insuranceActive,
          profileImage: provider.profileImage
        });

        this.setServices(provider.services || []);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando proveedor:', error);
        this.statusMessage = {
          text: 'No se pudo cargar el perfil del proveedor.',
          type: 'error'
        };
        this.isLoading = false;
      }
    });
  }

  get servicesArray(): FormArray {
    return this.providerForm.get('services') as FormArray;
  }

  createServiceGroup(service?: any): FormGroup {
    return this.fb.group({
      id: [service?.id || this.generateServiceId()],
      name: [service?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [service?.description || '', [Validators.required, Validators.minLength(10)]],
      price: [service?.price || '', [Validators.required]],
      duration: [service?.duration || '', [Validators.required]]
    });
  }

  setServices(services: any[]): void {
    this.servicesArray.clear();

    if (services?.length) {
      services.forEach(service => {
        this.servicesArray.push(this.createServiceGroup(service));
      });
    } else {
      this.addService();
    }
  }

  addService(): void {
    this.servicesArray.push(this.createServiceGroup());
  }

  removeService(index: number): void {
    if (this.servicesArray.length > 1) {
      this.servicesArray.removeAt(index);
    }
  }

  generateServiceId(): string {
    return `service-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.selectedFileError = '';

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      this.selectedFileError = 'Formato no permitido. Usa JPG, PNG o WEBP.';
      return;
    }

    if (file.size > maxSize) {
      this.selectedFileError = 'La imagen supera el tamaño máximo de 5MB.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.providerForm.patchValue({
        profileImage: this.imagePreview
      });
    };
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.imagePreview = null;
    this.providerForm.patchValue({
      profileImage: ''
    });
    this.selectedFileError = '';
  }

  handleSave(): void {
    this.statusMessage = { text: '', type: null };

    if (this.providerForm.invalid) {
      this.providerForm.markAllAsTouched();
      this.statusMessage = {
        text: 'Por favor corrige los campos marcados antes de guardar.',
        type: 'error'
      };
      return;
    }

    this.isSubmitting = true;

    const formValue = this.providerForm.getRawValue();

    const updatedProvider: ProviderProfile = {
      ...this.providerData,
      fullName: formValue.fullName,
      email: formValue.email,
      phone: formValue.phone,
      zone: formValue.zone,
      bio: formValue.bio,
      yearsExperience: Number(formValue.yearsExperience),
      insuranceActive: formValue.insuranceActive,
      profileImage: formValue.profileImage || '',
      services: formValue.services
    };

    this.profileService.updateProviderProfile(this.providerId, updatedProvider).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.statusMessage = {
          text: 'Perfil del proveedor actualizado correctamente.',
          type: 'success'
        };

        setTimeout(() => {
          this.router.navigate(['/provider-profile', this.providerId]);
        }, 800);
      },
      error: (error) => {
        console.error('Error actualizando proveedor:', error);
        this.isSubmitting = false;
        this.statusMessage = {
          text: 'Ocurrió un error al guardar los cambios.',
          type: 'error'
        };
      }
    });
  }

  handleCancel(): void {
    this.statusMessage = { text: '', type: null };
    this.router.navigate(['/provider-profile', this.providerId]);
  }

  getFieldError(fieldName: string): string | null {
    const field = this.providerForm.get(fieldName);

    if (!field || !field.touched || !field.errors) return null;

    if (field.errors['required']) return 'Este campo es obligatorio.';
    if (field.errors['email']) return 'Ingresa un correo válido.';
    if (field.errors['minlength']) {
      return `Debe tener al menos ${field.errors['minlength'].requiredLength} caracteres.`;
    }
    if (field.errors['min']) {
      return `El valor mínimo permitido es ${field.errors['min'].min}.`;
    }

    return 'Campo inválido.';
  }

  getServiceFieldError(index: number, fieldName: string): string | null {
    const serviceGroup = this.servicesArray.at(index) as FormGroup;
    const field = serviceGroup.get(fieldName);

    if (!field || !field.touched || !field.errors) return null;

    if (field.errors['required']) return 'Este campo es obligatorio.';
    if (field.errors['minlength']) {
      return `Debe tener al menos ${field.errors['minlength'].requiredLength} caracteres.`;
    }

    return 'Campo inválido.';
  }

  trackByIndex(index: number): number {
    return index;
  }
}
