import { Component, inject, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../auth/application/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private router = inject(Router);
  private authService = inject(AuthService);

  // Signals reactivos
  currentUser = this.authService.currentUser;
  userInitials = this.authService.userInitials;

  // Títulos por ruta
  titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/devices': 'Dispositivos',
    '/scheduling': 'Programación',
    '/reports': 'Reportes',
    '/profile': 'Mi Perfil',
    '/alerts': 'Alertas',
    '/settings': 'Configuración',
    '/help': 'Ayuda'
  };

  showMenu = false;

  get currentTitle(): string {
    const path = this.router.url.split('?')[0];
    return this.titles[path] || '';
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }

  async logout() {
    await this.authService.logout();
    this.closeMenu();
  }
}
