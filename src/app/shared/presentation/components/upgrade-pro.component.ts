import { Component } from '@angular/core';

@Component({
  selector: 'app-upgrade-pro',
  standalone: true,
  template: `
    <div class="upgrade-pro-container">
      <h2>Upgrade a Pro</h2>
      <p>Proximamente disponible. Personaliza aquí la experiencia Pro.</p>
    </div>
  `,
  styles: [`
    .upgrade-pro-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    h2 {
      color: #4A90E2;
      margin-bottom: 8px;
    }
    p {
      color: #8A8A8A;
    }
  `]
})
export class UpgradeProComponent {}
