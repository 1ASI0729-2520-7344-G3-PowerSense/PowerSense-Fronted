import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  // Simulación de usuario
  user = {
    name: 'Juan Pérez',
    initials: 'JP',
    avatarUrl: '' // Si se agrega una imagen, se usará aquí
  };

  // Títulos por ruta
  titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/devices': 'Dispositivos',
    '/scheduling': 'Programación',
    '/reports': 'Reportes',
    '/alerts': 'Alertas',
    '/help': 'Ayuda'
  };

  showMenu = false;

  constructor(public router: Router) { }

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
}
