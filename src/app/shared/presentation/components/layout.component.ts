import { Component } from '@angular/core';
import { Sidebar } from './sidebar/sidebar';
import { Navbar } from './navbar/navbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Sidebar, Navbar, RouterOutlet],
  template: `
    <div class="layout-container">
      <app-sidebar></app-sidebar>
      <main class="layout-content">
        <app-navbar></app-navbar>
        <div class="layout-router-content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      height: 100vh;
      width: 100vw;
      background: #F7F9FB;
    }
    app-sidebar {
      flex-shrink: 0;
      z-index: 2;
      box-shadow: 1px 0 0 #EAEAEA;
      height: 100vh;
    }
    .layout-content {
      flex: 1 1 0%;
      min-width: 0;
      padding: 0;
      overflow: auto;
      background: #F7F9FB;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .layout-router-content {
      flex: 1 1 0%;
      min-width: 0;
      display: flex;
      flex-direction: column;
      overflow: auto;
      padding: 24px 32px; /* asegurar espacio debajo del navbar */
    }
  `]
})
export class LayoutComponent {}
