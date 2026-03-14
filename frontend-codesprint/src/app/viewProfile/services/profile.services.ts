import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SeniorProfile } from '../models/senior-profile.model';
import { FamilyProfile } from '../models/family-profile.model';
import { ProviderProfile } from '../models/provider-profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private seniorProfile: SeniorProfile = {
    id: '1',
    fullName: 'María Elena Rodríguez',
    age: 74,
    gender: 'Femenino',
    phone: '8888-7777',
    address: 'San José, Costa Rica',
    familyMember: 'Carlos Rodríguez',
    relation: 'Hijo',
    email: 'maria@example.com',
    emergencyName: 'Carlos Rodríguez',
    emergencyRelation: 'Hijo',
    emergencyPhone: '8888-1111',
    mobility: 'Usa bastón para caminar',
    medical: 'Hipertensión controlada',
    allergies: 'Penicilina',
    profileImage: null,
    memberSince: ''
  };

  private familyProfile: FamilyProfile = {
    id: '2',
    fullName: 'Carlos Rodríguez',
    phone: '8888-1111',
    email: 'carlos@example.com',
    profileImage: null,
    relationToSenior: 'Hijo',
    emergencyName: 'Laura Rodríguez',
    emergencyRelation: 'Esposa',
    emergencyPhone: '8888-2222',
    importantNotes: 'Prefiere contacto por WhatsApp en horario laboral.',
    memberSince: ''
  };

  private providerProfile: ProviderProfile = {
    id: '1',
    fullName: 'Ana María Rodríguez',
    phone: '8888-1234',
    email: 'ana.rodriguez@example.com',
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=800&fit=crop',
    address: 'San José Centro',
    rating: 4.9,
    reviews: 127,
    verified: true,
    zone: 'San José Centro',
    yearsExperience: 8,
    bio: 'Profesional certificada en cuidado de adultos mayores con más de 8 años de experiencia. Me especializo en transporte seguro y acompañamiento personalizado.',
    insuranceActive: true,
    services: [
      {
        id: 's1',
        name: 'Transporte + Acompañamiento',
        description: 'Traslado seguro con asistencia personalizada a citas médicas',
        price: '₡15,000/hora',
        duration: '2-4 horas',
      },
      {
        id: 's2',
        name: 'Acompañamiento en Compras',
        description: 'Asistencia en supermercados y farmacias',
        price: '₡12,000/hora',
        duration: '1-2 horas',
      },
      {
        id: 's3',
        name: 'Transporte a Terapias',
        description: 'Traslado a sesiones de fisioterapia o rehabilitación',
        price: '₡14,000/hora',
        duration: '2-3 horas',
      },
    ],
    reviewsList: [
      {
        id: 'r1',
        author: 'María González',
        rating: 5,
        date: '15 Ene 2025',
        comment: 'Excelente profesional, muy puntual y atenta con mi madre.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      },
      {
        id: 'r2',
        author: 'Carlos Jiménez',
        rating: 5,
        date: '8 Ene 2025',
        comment: 'Ana es muy profesional y responsable.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      },
    ],
    memberSince: ''
  };

  // =========================
  // SENIOR PROFILE
  // =========================
  getProfile(): Observable<SeniorProfile> {
    const saved = localStorage.getItem('senior-profile');

    if (saved) {
      this.seniorProfile = JSON.parse(saved);
    }

    return of(this.seniorProfile);
  }

  updateProfile(profile: SeniorProfile): Observable<SeniorProfile> {
    this.seniorProfile = { ...profile };
    localStorage.setItem('senior-profile', JSON.stringify(this.seniorProfile));
    return of(this.seniorProfile);
  }

  // =========================
  // FAMILY PROFILE
  // =========================
  getFamilyProfile(): Observable<FamilyProfile> {
    const saved = localStorage.getItem('family-profile');

    if (saved) {
      this.familyProfile = JSON.parse(saved);
    }

    return of(this.familyProfile);
  }

  updateFamilyProfile(profile: FamilyProfile): Observable<FamilyProfile> {
    this.familyProfile = { ...profile };
    localStorage.setItem('family-profile', JSON.stringify(this.familyProfile));
    return of(this.familyProfile);
  }

  // =========================
  // PROVIDER PROFILE
  // =========================
  getProviderProfile(id?: string): Observable<ProviderProfile> {
    const storageKey = `provider-profile-${id || this.providerProfile.id}`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      this.providerProfile = JSON.parse(saved);
    } else {
      localStorage.setItem(storageKey, JSON.stringify(this.providerProfile));
    }

    return of(this.providerProfile);
  }

  updateProviderProfile(id: string, profile: ProviderProfile): Observable<ProviderProfile> {
    this.providerProfile = { ...profile };

    const storageKey = `provider-profile-${id}`;
    localStorage.setItem(storageKey, JSON.stringify(this.providerProfile));

    return of(this.providerProfile);
  }
}
