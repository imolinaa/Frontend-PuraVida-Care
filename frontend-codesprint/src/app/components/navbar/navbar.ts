import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html'
})
export class Navbar {

  navItems = [
    { label: 'Home', path: '', icon: 'home' },
    { label: 'Explorar', path: '/explorar', icon: 'search' },
    { label: 'Agenda', path: '/agenda', icon: 'calendar' },
    { label: 'Chat IA', path: '/chat-ia', icon: 'bot' },
    { label: 'Mensajes', path: '/mensajes', icon: 'message-circle' },
    { label: 'Perfil', path: '/profile', icon: 'user' }
  ];

}
