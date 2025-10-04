import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';

interface SidebarNavItem {
  label: string;
  icon: string; // nombre del icono, para futuro uso
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, NgFor, NgIf],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  navItems: SidebarNavItem[] = [
    { label: 'Dashboard', icon: '', route: '/dashboard' },
    { label: 'Dispositivos', icon: '', route: '/devices' },
    { label: 'Programación', icon: '', route: '/scheduling' },
    { label: 'Reportes', icon: '', route: '/reports' },
    { label: 'Alertas', icon: '', route: '/alerts' },
    { label: 'Configuración', icon: '', route: '/settings' },
    { label: 'Ayuda', icon: '', route: '/help' }
  ];

  constructor(public router: Router) {}

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
