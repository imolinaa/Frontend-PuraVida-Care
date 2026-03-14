import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HomeComponent } from '../client/home-client/home-client';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, HomeComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  constructor(private router: Router) {}

  features = [
    { iconChar: '♥', title: 'Cuidado Profesional', description: 'Accede a proveedores verificados y especializados' },
    { iconChar: '🛡', title: 'Seguro y Confiable', description: 'Todos los proveedores son verificados' },
    { iconChar: '⌚', title: 'Disponibilidad 24/7', description: 'Encuentra cuidado cuando lo necesites' },
    { iconChar: '👥', title: 'Comunidad', description: 'Únete a miles de familias y proveedores' },
  ];

  irALogin() {
    this.router.navigate(['/Home']);
  }
}